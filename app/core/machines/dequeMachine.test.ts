import { interpret } from "xstate"

import { dequeMachine } from "./dequeMachine"

const socket = jest.fn()
const handler = jest.fn()
const notifier = jest.fn()
const mockedDequeMachine = dequeMachine.withConfig({
  services: {
    dcsSocketCallback: () => socket,
  },
  actions: {
    notifyInitialized: notifier,
    handleFirstInDeque: handler,
  },
})
describe("DequeMachine", () => {
  it("should initialize and process an item", async () => {
    const dequeService = interpret(mockedDequeMachine).onTransition((state, event) => {
      if (event.type === "DCS_SOCKET_CONNECTED") {
        expect(notifier).toHaveBeenCalled()
        expect(state.value).toBe("idle")
        expect(socket).toHaveBeenCalled()
      }
      if (state.matches("handlingItem")) {
        expect(handler).toHaveBeenCalled()
      }
    })

    dequeService.start()
    dequeService.send({ type: "DCS_SOCKET_CONNECTED" })
    dequeService.send({
      type: "PUSH_ITEM",
      items: [
        {
          type: "SEND_MESSAGE",
          message: { action: "input", payload: { deviceId: 0, inputId: 0, value: 0 } },
          delay: 0,
        },
      ],
    })
    dequeService.send("ITEM_HANDLED")
  })
})
