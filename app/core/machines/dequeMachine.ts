import { DCSMessage } from "app/dcsIntegration/messageTypes"
import { assign, createMachine, InvokeCallback, send, sendParent } from "xstate"

export interface DequeMachineContext {
  deque: DequeItem[]
  socketRef?: any
}

type DequeItem = SendMessage

export type SendMessage = {
  type: "SEND_MESSAGE"
  message: DCSMessage
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
  | { type: "RESET" }
  | SendMessage

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
    initial: "checkingDeque",
    context: {
      deque: [],
    },
    on: {
      RESET: {
        actions: "clearDeque",
      },
    },
    states: {
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
        },
        after: [
          {
            delay: ({ deque }) => deque[0]?.delay || 0,
            target: "checkingDeque",
          },
        ],
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
    actions: {
      clearDeque: assign({ deque: [] }),
      handleFirstInDeque: sendParent(({ deque }) => deque[0]!),
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
