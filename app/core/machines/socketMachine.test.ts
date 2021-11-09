import { interpret } from "xstate"

import { socketMachine } from "./socketMachine"

it.skip("should contact the server", async () => {
  const buttonPresserService = interpret(socketMachine).onTransition((state) => {
    console.log({ state: state.value })
    if (state.matches("ready")) {
      buttonPresserService.send({ type: "SEND_MESSAGE", message: "ping" })
    }
  })

  buttonPresserService.start()

  await new Promise((resolve) => setTimeout(resolve, 2000))
  // done()
})
