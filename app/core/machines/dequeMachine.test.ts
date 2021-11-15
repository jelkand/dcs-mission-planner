import { interpret } from "xstate"

import { dequeMachine } from "./dequeMachine"

const handler = jest.fn()
const mockedDequeMachine = dequeMachine.withConfig({
  actions: {
    handleFirstInDeque: handler,
  },
})
describe("DequeMachine", () => {
  it("should initialize and process an item", async () => {
    const dequeService = interpret(mockedDequeMachine)
    dequeService.start()

    expect(dequeService.state.matches("idle")).toBe(true)
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
    expect(handler).toHaveBeenCalled()
    dequeService.send("ITEM_HANDLED")
  })
})
