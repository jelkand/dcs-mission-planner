import { Button } from "@chakra-ui/button"
import { Code } from "@chakra-ui/layout"
import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
// import { w3cwebsocket as W3CWebSocket } from "websocket"
import useWebSocket, { ReadyState } from "react-use-websocket"

// const client = new W3CWebSocket(
// )

const DCS_SOCKET = `${process.env.BLITZ_PUBLIC_DCS_SOCKET_HOST}:${process.env.BLITZ_PUBLIC_DCS_SOCKET_PORT}`

export const DcsSocketIntegration = () => {
  const [socketUrl, setSocketUrl] = useState(DCS_SOCKET)
  const messageHistory: MutableRefObject<any> = useRef([])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (event) => {
      console.log(event)
      return true
    },
    reconnectInterval: 10000,
    protocols: "echo",
  })

  messageHistory.current = useMemo(
    () => messageHistory?.current?.concat(lastMessage),
    [lastMessage]
  )

  const handleClickSendMessage = useCallback(() => sendJsonMessage({ name: "Ping" }), [])

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState]

  return (
    <div>
      <Button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
        Click Me to send &apos;Ping&apos;
      </Button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory?.current?.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  )
}
