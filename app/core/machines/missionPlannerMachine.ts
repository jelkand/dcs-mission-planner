import { hornetMachine } from "app/aircraft/hornet/hornetMachine"
import { ActorRefFrom, assign, createMachine, forwardTo, spawn } from "xstate"

import { dequeMachine, DequeMachineEvent } from "./dequeMachine"
import { socketMachine, SocketMachineEvent } from "./socketMachine"

export interface MissionPlannerMachineContext {
  dequeRef: ActorRefFrom<typeof dequeMachine> | null
  socketRef: ActorRefFrom<typeof socketMachine> | null
  aircraftRef: ActorRefFrom<typeof hornetMachine> | null
}

export type MissionPlannerMachineEvent = SocketMachineEvent | DequeMachineEvent

export const missionPlannerMachine = createMachine<
  MissionPlannerMachineContext,
  MissionPlannerMachineEvent
>({
  id: "missionPlanner",
  initial: "active",
  context: {
    socketRef: null,
    dequeRef: null,
    aircraftRef: null,
  },
  entry: assign({
    socketRef: (ctx) => spawn(socketMachine, { name: "socket", sync: true }),
    dequeRef: (ctx) => spawn(dequeMachine, { name: "deque", sync: true }),
    aircraftRef: (ctx) => spawn(hornetMachine, { name: "aircraft", sync: true }),
  }),
  states: {
    active: {
      on: {
        PUSH_ITEM: { actions: forwardTo("deque") },
        UNSHIFT_ITEM: { actions: forwardTo("deque") },
        SEND_MESSAGE: { actions: forwardTo("socket") },
      },
    },
  },
})
