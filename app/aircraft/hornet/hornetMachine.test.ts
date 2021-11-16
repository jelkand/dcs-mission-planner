import { interpret } from "xstate"

import { hornetMachine, HornetMachineContext } from "./hornetMachine"

const mockSpawnDeque = jest.fn()
const mockSetCockpitForWaypointEntry = jest.fn()
const mockInputNextWaypoint = jest.fn()
const mockIncrementAMPCDWaypoint = jest.fn()
const configuredHornetMachine = hornetMachine
  .withContext({
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
  .withConfig({
    actions: {
      spawnDeque: mockSpawnDeque,
      setCockpitForWaypointEntry: mockSetCockpitForWaypointEntry,
      inputNextWaypoint: mockInputNextWaypoint,
      incrementAMPCDWaypoint: mockIncrementAMPCDWaypoint,
    },
  })
describe("HornetMachine ", () => {
  it("should set up waypoints", async () => {
    const hornetService = interpret(configuredHornetMachine)

    hornetService.start()
    expect(hornetService.state.matches("idle")).toBe(true)
    hornetService.send("START_ENTRY")
    expect(hornetService.state.context.currentWaypoint).toBe(3)
    expect(hornetService.state.matches("idle")).toBe(true)
    expect(mockInputNextWaypoint).toBeCalledTimes(3)
    expect(mockIncrementAMPCDWaypoint).toBeCalledTimes(3)
  })
})
