import { hornetMachine, HornetMachineEvent } from "app/aircraft/hornet/hornetMachine"
import { ActorRefFrom, assign, createMachine, forwardTo, spawn } from "xstate"

import { dequeMachine, DequeMachineEvent } from "./dequeMachine"
import { socketMachine, SocketMachineEvent } from "./socketMachine"

export interface MissionPlannerMachineContext {
  dequeRef: ActorRefFrom<typeof dequeMachine> | null
  socketRef: ActorRefFrom<typeof socketMachine> | null
  aircraftRef: ActorRefFrom<typeof hornetMachine> | null
}

export type MissionPlannerMachineEvent = SocketMachineEvent | DequeMachineEvent | HornetMachineEvent

export const missionPlannerMachine = createMachine<
  MissionPlannerMachineContext,
  MissionPlannerMachineEvent
>({
  id: "missionPlanner",
  initial: "initializing",
  context: {
    socketRef: null,
    dequeRef: null,
    aircraftRef: null,
  },
  entry: assign({
    socketRef: (ctx) => spawn(socketMachine, { name: "socket" }),
    dequeRef: (ctx) => spawn(dequeMachine, { name: "deque" }),
    aircraftRef: (ctx) => spawn(hornetMachine, { name: "aircraft" }),
  }),
  on: {
    RESET: {
      actions: [forwardTo("aircraft"), forwardTo("deque"), forwardTo("socket")],
    },
  },
  states: {
    initializing: {
      on: {
        SOCKET_INITIALIZED: "active",
      },
    },
    active: {
      on: {
        PUSH_ITEM: { actions: forwardTo("deque") },
        UNSHIFT_ITEM: { actions: forwardTo("deque") },
        SEND_MESSAGE: { actions: forwardTo("socket") },
        SET_WAYPOINTS: { actions: forwardTo("aircraft") },
        START_ENTRY: { actions: forwardTo("aircraft") },
      },
    },
  },
})
