/* This is the first pass at building a machine to 'promisify' a socket
 * Keeping it around for future reference.
 */

import { createMachine, forwardTo, sendUpdate } from "xstate"
import { send } from "xstate"

const DCS_SOCKET = `${process.env.BLITZ_PUBLIC_DCS_SOCKET_HOST}:${process.env.BLITZ_PUBLIC_DCS_SOCKET_PORT}`

export interface SocketMachineContext {}

interface SocketMachine {
  action: string
}

export type SocketMachineEvent =
  | {
      type: "SEND_MESSAGE"
      message: any
    }
  | { type: "DCS_SOCKET_CONNECTED" }
  | { type: "MESSAGE_RECEIVED"; response: any }
  | { type: "ERROR_RECEIVED" }
  | { type: "DCS_SOCKET_CLOSED" }

export const socketMachine = createMachine<SocketMachineContext, SocketMachineEvent>(
  {
    id: "socket",
    initial: "idle",
    invoke: {
      id: "dcsSocket",
      src: "dcsSocketCallback",
    },
    states: {
      idle: {
        on: { DCS_SOCKET_CONNECTED: "ready" },
      },
      ready: {
        on: { SEND_MESSAGE: { target: "waiting", actions: forwardTo("dcsSocket") } },
      },
      waiting: {
        on: {
          MESSAGE_RECEIVED: {
            target: "ready",
            actions: sendUpdate(),
          },
          ERROR_RECEIVED: "error",
        },
      },
      error: {},
    },
  },
  {
    services: {
      dcsSocketCallback: (src, event) => (callback, onReceive) => {
        const dcsSocket = new WebSocket(DCS_SOCKET, "json")

        dcsSocket.onmessage = (data) => callback({ type: "MESSAGE_RECEIVED", response: data })

        dcsSocket.onopen = (data) => {
          callback({ type: "DCS_SOCKET_CONNECTED" })
        }

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
  }
)
