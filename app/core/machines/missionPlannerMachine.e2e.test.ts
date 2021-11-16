import { interpret } from "xstate"

import { missionPlannerMachine } from "./missionPlannerMachine"

describe.skip("Mission Planner Machine", () => {
  it("should connect to the socket", async () => {
    const missionPlannerService = interpret(missionPlannerMachine).onTransition((state, event) => {
      console.log({ state: state.value, event })
    })

    missionPlannerService.start()
    missionPlannerService.send({
      type: "PUSH_ITEM",
      items: [
        {
          type: "SEND_MESSAGE",
          message: { action: "input", payload: { deviceId: 0, inputId: 0, value: 0 } },
          delay: 0,
        },
      ],
    })

    // const socketService = interpret(socketMachine).onTransition((state) => {
    //   console.log({ state: state.value })
    // })
    // socketService.start()
    await new Promise((resolve) => setTimeout(resolve, 2000))
  })
})
