import { hornetMachine } from "app/aircraft/hornet/hornetMachine"
import { Actor, ActorRefFrom, createMachine, forwardTo, spawn } from "xstate"

import { dequeMachine, DequeMachineEvent } from "./dequeMachine"
import { socketMachine, SocketMachineEvent } from "./socketMachine"

export interface MissionPlannerMachineContext {
  dequeRef: ActorRefFrom<typeof dequeMachine>
  socketRef: ActorRefFrom<typeof socketMachine>
  aircraftRef: ActorRefFrom<typeof hornetMachine>
}

export type MissionPlannerMachineEvent = SocketMachineEvent | DequeMachineEvent

export const missionPlannerMachine = createMachine({
  id: "missionPlanner",
  initial: "active",
  context: {
    dequeRef: spawn(dequeMachine, { name: "deque", autoForward: true, sync: true }),
    socketRef: spawn(socketMachine, { name: "socket", autoForward: true, sync: true }),
    aircraftRef: spawn(hornetMachine, { name: "hornet", autoForward: true, sync: true }),
  },
  states: {
    active: {},
  },
})
