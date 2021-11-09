import { interpret } from "xstate"

import { dequeMachine } from "./dequeMachine"

it.skip("should contact the server", async () => {
  const dequeService = interpret(dequeMachine).onTransition((state) => {
    console.log({ state: state.value })
    if (state.matches("checkingDeque") || state.matches("idle")) {
      console.log("can accept")
    }
  })

  dequeService.start()
  dequeService.send({
    type: "PUSH_ITEM",
    items: [
      { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
      { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
      { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
      { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
      { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
    ],
  })

  await new Promise((resolve) => setTimeout(resolve, 2000))
  // done()
})
