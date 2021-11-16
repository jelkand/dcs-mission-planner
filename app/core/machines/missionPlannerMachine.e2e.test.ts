import { interpret } from "xstate"

import { missionPlannerMachine } from "./missionPlannerMachine"

describe.skip("Mission Planner Machine", () => {
  it("should connect to the socket", async () => {
    const missionPlannerService = interpret(missionPlannerMachine).onTransition((state, event) => {
      // console.log({ event })
      // console.log("deque state", state.context.dequeRef?.getSnapshot()?.value)
    })

    missionPlannerService.start()
    await new Promise((resolve) => setTimeout(resolve, 500))
    missionPlannerService.send({
      type: "SET_WAYPOINTS",
      waypoints: [
        {
          latitude: ["N", "2", "4", "5", "2", "6", "6"],
          longitude: ["E", "5", "3", "5", "3", "3", "0"],
        },
        {
          latitude: ["N", "2", "5", "0", "6", "6", "9"],
          longitude: ["E", "5", "4", "2", "4", "0", "0"],
        },
        {
          latitude: ["N", "2", "5", "2", "4", "0", "8"],
          longitude: ["E", "5", "4", "3", "9", "5", "5"],
        },
        {
          latitude: ["N", "2", "5", "5", "2", "7", "6"],
          longitude: ["E", "5", "5", "0", "2", "0", "3"],
        },
        {
          latitude: ["N", "2", "4", "5", "2", "6", "6"],
          longitude: ["E", "5", "3", "5", "3", "3", "0"],
        },
        {
          latitude: ["N", "2", "6", "3", "4", "4", "7"],
          longitude: ["E", "5", "6", "1", "8", "7", "1"],
        },
      ],
    })
    missionPlannerService.send("START_ENTRY")

    await new Promise((resolve) => setTimeout(resolve, 5000))
  })
})
