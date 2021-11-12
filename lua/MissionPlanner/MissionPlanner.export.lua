package.path  = package.path..";.\\LuaSocket\\?.lua;"
package.cpath = package.cpath..";.\\LuaSocket\\?.dll;"

package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\?\\init.lua;"
package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\?.lua;"
package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\websocket\\?.lua;"
package.path  = package.path..";"..lfs.writedir().."Scripts\\MissionPlanner\\copas\\?.lua;"

local copas = require'copas'

local JSON = assert(loadfile "Scripts\\JSON.lua")()


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


local function executeClickableAction(args)
  missionPlanner.log("Pressing button " .. args.command .. " on device " .. args.device .. " with value " .. args.value)
  GetDevice(args.device):performClickableAction(args.command, args.value)
end


local function echo_protocol(ws)
  missionPlanner.log("got new client")
  while true do
    missionPlanner.log("Copas looping")
    local message = ws:receive()
    if message then
      missionPlanner.log("Got message: " .. message)
        ws:send(message)
    else
        ws:close()
        return
    end
  end
end

local function json_protocol(ws)
  missionPlanner.log("got json client")
  while true do
    local message = ws:receive()
    if message then
      local decodedMessage = JSON:decode(message)
      missionPlanner.log("Prettified: " .. JSON:encode_pretty(decodedMessage))
    else
      ws:close()
      return
    end
  end
end

missionPlanner.insert = {
  Start = function(self)
    missionPlanner.server = require'websocket'.server.copas.listen
    {
      -- listen on port 8080
      port = 8675,
      -- the protocols field holds
      --   key: protocol name
      --   value: callback on new connection
      protocols = {
        -- this callback is called, whenever a new client connects.
        -- ws is a new websocket instance
        echo = echo_protocol,
        json = json_protocol,
        default = echo_protocol
      },
      on_error = function(err)
        missionPlanner.log("Copas Err: " .. err)
      end
    }

    missionPlanner.log("Established socket...")
  end,
  BeforeNextFrame = function(self)
    local handled, err = copas.step(0)
    if err then
      missionPlanner.log("Step Error: " .. err)
    end
	end,
  Stop = function(self)

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
do
	local OtherLuaExportStop=LuaExportStop
	LuaExportStop=function()
    missionPlanner.insert:Stop()
		if OtherLuaExportStop then
			OtherLuaExportStop()
		end
	end
end
