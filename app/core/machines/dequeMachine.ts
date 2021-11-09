import { assign, createMachine, send } from "xstate"

const DCS_SOCKET = `${process.env.BLITZ_PUBLIC_DCS_SOCKET_HOST}:${process.env.BLITZ_PUBLIC_DCS_SOCKET_PORT}`

export interface DequeMachineContext {
  deque: DequeItem[]
  socketRef?: any
}

interface DequeItem {
  type: string
  payload: any
  delay?: number
}

export type DequeMachineEvent =
  | {
      type: "PUSH_ITEM"
      items: DequeItem[]
    }
  | {
      type: "UNSHIFT_ITEM"
      items: DequeItem[]
    }
  | { type: "DCS_SOCKET_CONNECTED" }
  | { type: "ITEM_HANDLED" }
// | { type: "SEND_MESSAGE" }

const pushOrUnshiftActions = {
  PUSH_ITEM: {
    actions: "pushItem",
  },
  UNSHIFT_ITEM: {
    actions: "unshiftItem",
  },
}

export const dequeMachine = createMachine<DequeMachineContext, DequeMachineEvent>(
  {
    id: "deque",
    initial: "initializing",
    context: {
      deque: [],
    },
    invoke: {
      id: "dcsSocket",
      src: "dcsSocketCallback",
    },
    states: {
      initializing: {
        on: { ...pushOrUnshiftActions, DCS_SOCKET_CONNECTED: "checkingDeque" },
      },
      idle: {
        on: {
          PUSH_ITEM: {
            actions: "pushItem",
            target: "handlingItem",
          },
          UNSHIFT_ITEM: {
            actions: "unshiftItem",
            target: "handlingItem",
          },
        },
      },
      handlingItem: {
        on: {
          ...pushOrUnshiftActions,
          ITEM_HANDLED: {
            target: "checkingDeque",
          },
        },
        entry: "handleFirstInDeque",
        exit: "shiftItem",
      },
      checkingDeque: {
        on: {
          ...pushOrUnshiftActions,
        },
        always: [{ cond: "dequeHasItems", target: "handlingItem" }, { target: "idle" }],
      },
    },
  },
  {
    guards: {
      dequeHasItems: ({ deque }) => deque.length > 0,
    },
    services: {
      dcsSocketCallback: (ctx, event) => (callback, onReceive) => {
        console.log("setting up socket")
        const dcsSocket = new WebSocket(DCS_SOCKET, "json")

        // for now don't care about response
        // dcsSocket.onmessage = (data) => callback({ type: "MESSAGE_RECEIVED", response: data })

        dcsSocket.onopen = (data) => {
          callback({ type: "DCS_SOCKET_CONNECTED" })
        }

        // for now don't care about errors or closing
        // dcsSocket.onerror = (data) => {
        //   console.log("error", { data })
        // }

        // dcsSocket.onclose = (data) => {
        //   callback("DCS_SOCKET_CLOSED")
        // }

        onReceive((event) => {
          console.log("got event", { event })
          if (event.type === "SEND_MESSAGE") {
            dcsSocket.send(JSON.stringify(event.message))
            callback({ type: "ITEM_HANDLED" })
          }
        })

        return () => {
          dcsSocket.close()
        }
      },
    },
    actions: {
      handleFirstInDeque: send(
        ({ deque }) => {
          const firstItem = deque[0]
          return { type: "SEND_MESSAGE", message: firstItem?.payload }
        },
        { to: "dcsSocket", delay: ({ deque }) => deque[0]?.delay || 0 }
      ),
      shiftItem: assign((context) => {
        const [, ...deque] = context.deque
        return {
          deque,
        }
      }),
      pushItem: assign(({ deque }, event) => {
        if (event.type !== "PUSH_ITEM") {
          return {}
        }
        return { deque: [...deque, ...event.items] }
      }),
      unshiftItem: assign(({ deque }, event) => {
        if (event.type !== "UNSHIFT_ITEM") {
          return {}
        }
        return { deque: [...event.items, ...deque] }
      }),
    },
  }
)
