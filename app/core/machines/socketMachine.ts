import { DCSMessage } from "app/dcsIntegration/messageTypes"
import { assign, createMachine, forwardTo, InvokeCallback, send, sendParent } from "xstate"

const DCS_SOCKET = `${process.env.BLITZ_PUBLIC_DCS_SOCKET_HOST}:${process.env.BLITZ_PUBLIC_DCS_SOCKET_PORT}`

export interface SocketMachineContext {
  maxRetries: number
  currentRetries: number
  retryInterval: number
}

export type SendMessage = {
  type: "SEND_MESSAGE"
  message: DCSMessage
  delay?: number
}

export type SocketMachineEvent =
  | {
      type: "DCS_SOCKET_CLOSED"
    }
  | {
      type: "ATTEMPT_CONNECTION"
    }
  | { type: "DCS_SOCKET_CONNECTED" }
  | { type: "MESSAGE_RECEIVED"; response: any }
  | SendMessage

export const socketMachine = createMachine<SocketMachineContext, SocketMachineEvent>(
  {
    id: "socket",
    initial: "open",
    context: {
      maxRetries: 12,
      currentRetries: 0,
      retryInterval: 5000,
    },
    on: {
      DCS_SOCKET_CLOSED: "closed",
    },
    states: {
      open: {
        initial: "initializing",
        invoke: {
          id: "dcsSocket",
          src: "dcsSocketCallback",
        },
        states: {
          initializing: {
            on: { DCS_SOCKET_CONNECTED: "ready" },
            exit: "notifyInitialized",
          },
          ready: {
            on: {
              SEND_MESSAGE: { actions: "forwardToSocket" },
              MESSAGE_RECEIVED: { actions: "sendToParent" },
            },
          },
        },
      },
      closed: {
        always: [{ target: "retryingConnection", cond: "hasNotExceededRetries" }],
        on: {
          ATTEMPT_CONNECTION: "open",
        },
      },
      retryingConnection: {
        after: [
          {
            delay: ({ retryInterval }) => retryInterval,
            target: "open",
          },
        ],
        entry: assign({
          currentRetries: ({ currentRetries }) => currentRetries + 1,
        }),
      },
    },
  },
  {
    guards: {
      hasNotExceededRetries: ({ maxRetries, currentRetries }) => currentRetries < maxRetries,
    },
    services: {
      dcsSocketCallback:
        (ctx, event): InvokeCallback<SocketMachineEvent, SocketMachineEvent> =>
        (callback, onReceive) => {
          const dcsSocket = new WebSocket(DCS_SOCKET, "json")

          dcsSocket.onmessage = (data) => {
            console.log("got message", data)
            callback({ type: "MESSAGE_RECEIVED", response: data })
          }

          dcsSocket.onopen = () => {
            callback({ type: "DCS_SOCKET_CONNECTED" })
          }

          // for now don't care about errors or closing
          dcsSocket.onerror = (data) => {
            console.log("error", { data })
          }

          dcsSocket.onclose = (data) => {
            callback("DCS_SOCKET_CLOSED")
          }

          onReceive((event) => {
            if (event.type === "SEND_MESSAGE") {
              dcsSocket.send(JSON.stringify(event.message))
            }
          })

          return () => {
            dcsSocket.close()
          }
        },
    },
    actions: {
      notifyInitialized: sendParent({ type: "INITIALIZED" }),
      forwardToSocket: forwardTo("dcsSocket"),
      sendToParent: sendParent({ type: "MESSAGE_RECEIVED" }),
    },
  }
)
