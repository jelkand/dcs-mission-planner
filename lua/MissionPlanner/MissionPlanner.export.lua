package.path  = package.path..";.\\LuaSocket\\?.lua;"
package.cpath = package.cpath..";.\\LuaSocket\\?.dll;"

package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\?\\init.lua;"
package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\?.lua;"
-- package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\websocket\\?.lua;"
-- package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\websocket\\?.lua;"
-- package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\websocket\\websocket\\?.lua;"
-- package.cpath  = package.cpath..";"..lfs.writedir().."Scripts\\MissionPlanner\\websocket\\websocket\\?.dll;"


local socket = require("socket")
local JSON = assert(loadfile "Scripts\\JSON.lua")()
-- local copas = require'copas'
local mime = require 'mime'
local sha1 = require("sha1")
-- local server = require("websocket")

local socketKey = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
local clientKey = nil

local missionPlanner = {
  logFile = io.open(lfs.writedir() .. [[Logs\MissionPlanner.log]], "w")
}
function missionPlanner.log(str)
  if not str then
      return
  end

  if missionPlanner.logFile then
      missionPlanner.logFile:write("[" .. os.date("%H:%M:%S") .. "] " .. str .. "\r\n")
      missionPlanner.logFile:flush()
  end
end


missionPlanner.config = {
  server = {
    address = "localhost",
    port = 8675,
    timeout = 0,
  },
}

-- missionPlanner.client



-- -- create a copas webserver and start listening
-- local server = require'websocket'.server.copas.listen
-- {
--   -- listen on port 8080
--   port = 8675,
--   -- the protocols field holds
--   --   key: protocol name
--   --   value: callback on new connection
--   protocols = {
--     -- this callback is called, whenever a new client connects.
--     -- ws is a new websocket instance
--     echo = function(ws)
--       while true do
--         local message = ws:receive()
--         if message then
--            ws:send(message)
--         else
--            ws:close()
--            return
--         end
--       end
--     end
--   }
-- }


local headers = {}
local origin = ""
local location = ""


local function receiveClientHandshake()

end

local function executeClickableAction(args)
  missionPlanner.log("Pressing button " .. args.command .. " on device " .. args.device .. " with value " .. args.value)
  GetDevice(args.device):performClickableAction(args.command, args.value)
end

-- local function inputNextKeypress()
--   local input = table.remove(keypressSequence, 1);
--   keypressSequenceLength = keypressSequenceLength - 1;

--   if input == nil then
--     missionPlanner.log("Out of input, setting status to DONE...")
--     sequenceStatus = "DONE"
    
--     return nil
--   end

--   executeClickableAction(input)
--   return input.delay
-- end

local function getSocketAcceptKey()
  local concatenated = headers["sec-websocket-key"]..socketKey
  local sha = sha1.binary(concatenated)
  return (mime.b64(sha))
end

missionPlanner.insert = {
  Start = function(self)
    missionPlanner.log("Starting up socket on " .. missionPlanner.config.server.address .. " on port " .. missionPlanner.config.server.port)
    missionPlanner.server = socket.bind(missionPlanner.config.server.address,missionPlanner.config.server.port)
		missionPlanner.server:settimeout(missionPlanner.config.server.timeout)
		missionPlanner.server:setoption('tcp-nodelay', true)
    missionPlanner.server:setoption('keepalive', true)

    missionPlanner.log("Established socket...")
    -- copas.loop()
  end,
  BeforeNextFrame = function(self)

    if missionPlanner.client == nil then
      missionPlanner.client = missionPlanner.server:accept()
      missionPlanner.client:settimeout(0)
      missionPlanner.client:setoption('keepalive', true)


      --handshake
      local line1 = missionPlanner.client:receive("*l")
      missionPlanner.log("Got Data: " .. line1)
      while true do
        local line = missionPlanner.client:receive("*l")
        if (#line == 0) then
          break
        end
        local header_name, header_value = string.match(line, '^([^:]+): ?(.*)$')
        missionPlanner.log("Header " .. header_name .. ": " .. header_value)
        assert(header_name, string.format('invalid header: %q', line))
        header_name = string.lower(header_name)
        if (header_name == 'origin') then
          origin = header_value
        elseif (header_name == 'host') then
          location = 'ws://' .. header_value .. "/" -- path
        end
        headers[header_name] = header_value
      end
  
      missionPlanner.log("Responding"..getSocketAcceptKey())
      missionPlanner.client:send("HTTP/1.1 101 Web Socket Protocol Handshake" .. "\r\n"
      .. "Upgrade: WebSocket" .. "\r\n"
      .. "Connection: Upgrade" .. "\r\n"
      .. "WebSocket-Origin: " .. "origin" .. "\r\n"
      .. "WebSocket-Location: " .. "location" .. "\r\n"
      .. "WebSocket-Protocol: text" .. "\r\n"
      .. "Sec-WebSocket-Accept: " .. getSocketAcceptKey() .. "\r\n"
      .. "\r\n")
    end

    local data, err, part = missionPlanner.client:receive("*l")

    if data == '\000' then
      missionPlanner.log('got start char')
    end

    if data == '\255' then
      missionPlanner.log('got end char')
    end
   
    if data then
      missionPlanner.log("Got new data: " .. data)
    end

    if err and err ~= "timeout" then
      missionPlanner.log("Got new data error: " .. err)
    end
    if part then
      missionPlanner.log("Got new part: " .. part)
      missionPlanner.log("Part type: " .. type(part))
      missionPlanner.log("Part length: " .. string.len(part))
      missionPlanner.log("Unb64: " .. (mime.unb64(part)))
      -- missionPlanner.log("Got new part: " .. part)
    end

	end,
  Stop = function(self)
    missionPlanner.log("Shutting down...")
    if missionPlanner.server then
      socket.try(missionPlanner.server:close())
      missionPlanner.server = nil
    end
  end
}

do
	local OtherLuaExportStart=LuaExportStart
	LuaExportStart=function()
    missionPlanner.insert:Start()
		if OtherLuaExportStart then
			OtherLuaExportStart()
		end		
	end
end
do
	local OtherLuaExportBeforeNextFrame=LuaExportBeforeNextFrame
	LuaExportBeforeNextFrame=function()
    missionPlanner.insert:BeforeNextFrame()
		if OtherLuaExportBeforeNextFrame then
			OtherLuaExportBeforeNextFrame()
		end
	end
end
local _prevLuaExportActivityNextEvent = LuaExportActivityNextEvent


function LuaExportActivityNextEvent(tCurrent)

  if sequenceStatus == "READY" and _tNextWyptMgr - tCurrent < 0.01 then
    missionPlanner.log("Actioning sequence...")
    if sequenceStatus == "READY" then
      missionPlanner.log("Actioning input...")
      local delay = inputNextKeypress()
      _tNextWyptMgr = tCurrent + delay
    end
    if sequenceStatus == "DONE" then
      missionPlanner.log("Completed input.")
      -- reset state
      resetState()
    end
  end

  local tNext = _tNextWyptMgr

  if _prevLuaExportActivityNextEvent then
    local _status, _result = pcall(_prevLuaExportActivityNextEvent, tCurrent)
    if _status then
        -- Use lower of our tNext (0.2s) or the previous export's
        if _result and _result < tNext and _result > tCurrent then
            tNext = _result
        end
    else
        missionPlanner.log('ERROR Calling other LuaExportActivityNextEvent from another script...')
    end
  end

  return tNext
end

do
	local OtherLuaExportStop=LuaExportStop
	LuaExportStop=function()
    missionPlanner.insert:Stop()
		if OtherLuaExportStop then
			OtherLuaExportStop()
		end						
	end
end