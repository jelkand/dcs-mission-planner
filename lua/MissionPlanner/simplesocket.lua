-- websocket.lua
-- HTML5 websockets - simple module for sending and receiving messages using Copas

-- local assert = assert
-- local print = print
-- local tostring = tostring
local tconcat = table.concat
-- local string.format = string.format
-- local string.match = string.match
-- local string.lower = string.lower
local setmetatable = setmetatable
local getmetatable = getmetatable
local socket = require 'socket'
local mime = require 'mime'
local copas = require 'copas'


module (...)


local webskt_meta = {__index = _M}

-- websocket.wrap(skt)
-- !! skt is expected to be a copas socket
function wrap(skt)
  return setmetatable({skt = copas.wrap(skt)}, webskt_meta)
end

function receiveClientHandshake(webskt)
  assert(getmetatable(webskt) == webskt_meta, 'bad argument: expecting websocket')
  local line
  do
    line = webskt.skt:receive("*l")
    local path = string.match(line, 'GET (/[^ ]*) HTTP/1.1')
    assert(path, 'invalid first line: ' .. tostring(line))
    webskt.path = path
  end
  webskt.headers = {}
  -- "Upgrade: WebSocket"
  do
    line = webskt.skt:receive("*l")
    if (line ~= 'Upgrade: WebSocket') then
      return nil, string.format('second line must be "Upgrade: WebSocket" - received "%q"', line)
    end
    webskt.headers["upgrade"] = "WebSocket"
  end
  -- "Connection: Upgrade"
  do
    line = webskt.skt:receive("*l")
    if (line ~= 'Connection: Upgrade') then
      return nil, string.format('third line must be "Connection: Upgrade" - received "%q"', line)
    end
    webskt.headers["connection"] = "Upgrade"
  end
  -- Arbitrary headers
  while true do
    local line = webskt.skt:receive("*l")
    if (#line == 0) then
      break
    end
    local header_name, header_value = string.match(line, '^([^:]+): ?(.*)$')
    assert(header_name, string.format('invalid header: %q', line))
    header_name = string.lower(header_name)
    if (header_name == 'origin') then
      webskt.origin = header_value
    elseif (header_name == 'host') then
      webskt.location = 'ws://' .. header_value .. webskt.path
    end
    webskt.headers[header_name] = header_value
  end
  assert(webskt.location, 'missing "Host" header')
  assert(webskt.origin, 'missing "Origin" header')
end

function sendServerHandshake(webskt)
  assert(getmetatable(webskt) == webskt_meta, 'bad argument: expecting websocket')
  assert(webskt.origin and webskt.location, 'websocket object missing vital information')
  webskt.skt:send("HTTP/1.1 101 Web Socket Protocol Handshake" .. "\r\n"
    .. "Upgrade: WebSocket" .. "\r\n"
    .. "Connection: Upgrade" .. "\r\n"
    .. "WebSocket-Origin: " .. webskt.origin .. "\r\n"
    .. "WebSocket-Location: " .. webskt.location .. "\r\n"
    .. "WebSocket-Protocol: sample" .. "\r\n"
    .. "\r\n")
end

function receiveUTF8(webskt)
  assert(getmetatable(webskt) == webskt_meta, 'bad argument: expecting websocket')
  local b
  local msg = {}
  b = assert(webskt.skt:receive(1))
  if (b ~= '\000') then
    return nil, 'unrecognised frame character'
  end
  while true do
    b = assert(webskt.skt:receive(1))
    if (b == '\255') then
      break
    end
    msg[#msg+1] = b
  end
  return tconcat(msg)
end

function sendUTF8(webskt, msg)
  assert(getmetatable(webskt) == webskt_meta, 'bad argument: expecting websocket')
  msg = tostring(msg)
  assert(not string.match(msg, '[%z\255]'), 'message must not contain characters \\000 or \\255')
  webskt.skt:send('\000' .. msg .. '\255')
end

function receiveBase64(...)
  return mime.unb64(receiveUTF8(...))
end

function sendBase64(webskt, binstring)
  sendUTF8(webskt, mime.b64(binstring))
end
