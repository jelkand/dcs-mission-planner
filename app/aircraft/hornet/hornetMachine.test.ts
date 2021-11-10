import { interpret } from "xstate"

import { hornetMachine } from "./hornetMachine"

it("should contact the server", async () => {
  const hornetService = interpret(hornetMachine).onTransition((state, event) => {
    console.log({ state: state.value })
    // console.log({ context: state.context })
    // console.log({ event })
    if (state.matches("idle")) {
      hornetService.send({ type: "START" })
    }
  })

  hornetService.start()
  // hornetService.send({
  //   type: "PUSH_ITEM",
  //   items: [
  //     { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
  //     { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
  //     { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
  //     { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
  //     { type: "SEND_MESSAGE", payload: "ping", delay: 1500 },
  //   ],
  // })

  await new Promise((resolve) => setTimeout(resolve, 2000))
  // done()
})
