import { interpret } from "xstate"

import { hornetMachine, HornetMachineContext } from "./hornetMachine"

it("should contact the server", async () => {
  const configuredHornetMachine = hornetMachine.withContext({
    ...hornetMachine.context,
    currentWaypoint: 0,
    inputPlan: {
      waypoints: [
        { latitude: ["N", "3", "3"], longitude: ["E", "3", "3", "3"] },
        { latitude: ["N", "3", "3"], longitude: ["E", "3", "3", "3"] },
        { latitude: ["N", "3", "3"], longitude: ["E", "3", "3", "3"] },
      ],
    },
  })
  const hornetService = interpret(configuredHornetMachine).onTransition((state, event) => {
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

  await new Promise((resolve) => setTimeout(resolve, 5000))
  // done()
})
