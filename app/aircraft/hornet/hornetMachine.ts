import { dequeMachine } from "app/core/machines/dequeMachine"
import { Actor, ActorRefFrom, assign, createMachine, send, spawn } from "xstate"

export interface HornetMachineContext {
  dequeRef?: any //  ActorRefFrom<typeof dequeMachine>
  inputPlan?: {
    waypoints: Array<any>
  }
}

interface HornetItem {
  type: string
  payload: any
  delay?: number
}

export type HornetMachineEvent =
  | {
      type: "INITIALIZED"
    }
  | {
      type: "START"
    }
  | {
      type: "STOP"
    }
  | {
      type: "READY_FOR_WAYPOINTS"
    }
  | { type: "WAYPOINT_ENTRY_COMPLETE" }

export const hornetMachine = createMachine<HornetMachineContext, HornetMachineEvent>(
  {
    id: "hornetMachine",
    initial: "initializing",
    context: {
      // inputPlan: undefined,
      // dequeRef: undefined,
    },
    entry: assign({
      dequeRef: () => spawn(dequeMachine, "deque"),
    }),
    states: {
      initializing: {
        on: {
          INITIALIZED: "idle",
        },
      },
      idle: {
        on: { START: "setupWaypointEntry" },
      },
      setupWaypointEntry: {
        entry: "setCockpitForWaypointEntry",
        on: { READY_FOR_WAYPOINTS: "waypointEntry", STOP: "idle" },
      },
      waypointEntry: {
        initial: "incrementWaypoint",
        on: {
          WAYPOINT_ENTRY_COMPLETE: "idle",
          STOP: "idle",
        },
        states: {
          incrementWaypoint: { always: "inputWaypoint" },
          inputWaypoint: {
            always: [
              { target: "incrementWaypoint", cond: "hasMoreWaypoints" },
              // { target: "complete" },
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      setCockpitForWaypointEntry: send(
        {
          type: "PUSH_ITEM",
          items: [
            { type: "SEND_MESSAGE", payload: { device: 37, input: 3018, value: 0 }, delay: 200 },
            { type: "SEND_MESSAGE", payload: { device: 37, input: 3018, value: 0 }, delay: 200 },
            { type: "SEND_MESSAGE", payload: { device: 37, input: 3018, value: 0 }, delay: 200 },
            { type: "SEND_MESSAGE", payload: { device: 37, input: 3018, value: 0 }, delay: 200 },
            { type: "SEND_MESSAGE", payload: { device: 37, input: 3018, value: 0 }, delay: 200 },
          ],
        },
        { to: "deque" }
      ),
    },
  }
)
