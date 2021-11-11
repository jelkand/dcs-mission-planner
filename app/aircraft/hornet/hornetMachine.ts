import { dequeMachine } from "app/core/machines/dequeMachine"
import { ActorRefFrom, assign, createMachine, send, spawn } from "xstate"

import { enterSeq, HornetKey, nextWyptSeq, onOffInputReducer, startKeySeq } from "./inputs"

export interface HornetMachineContext {
  dequeRef: ActorRefFrom<typeof dequeMachine>
  inputPlan: {
    waypoints: Array<RawWaypoint>
  }
  currentWaypoint: number
}

interface RawWaypoint {
  latitude: Array<HornetKey>
  longitude: Array<HornetKey>
  elementOrder?: number
  flag?: any // bulls etc
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
    entry: "spawnDeque",
    states: {
      initializing: {
        on: {
          INITIALIZED: "idle",
        },
      },
      idle: {
        on: { START: "waypointEntry" },
      },
      waypointEntry: {
        entry: "setCockpitForWaypointEntry",
        initial: "inputWaypoint",
        on: {
          WAYPOINT_ENTRY_COMPLETE: "idle",
          STOP: "idle",
        },
        states: {
          inputWaypoint: {
            always: [
              {
                target: "incrementWaypoint",
                cond: "hasMoreWaypoints",
                actions: "inputNextWaypoint",
              },
              { target: "complete" },
            ],
          },
          incrementWaypoint: {
            entry: "incrementAMPCDWaypoint",
            always: "inputWaypoint",
            exit: "incrementWaypointCounter",
          },
          complete: {
            type: "final",
            entry: send("WAYPOINT_ENTRY_COMPLETE"),
          },
        },
      },
    },
  },
  {
    actions: {
      spawnDeque: assign({
        dequeRef: () => spawn(dequeMachine, "deque"),
      }),
      setCockpitForWaypointEntry: send(
        {
          type: "PUSH_ITEM",
          items: startKeySeq.reduce(onOffInputReducer, []),
        },
        { to: "deque" }
      ),
      inputNextWaypoint: send(
        ({ inputPlan, currentWaypoint }) => {
          const { latitude, longitude } = inputPlan.waypoints[currentWaypoint]!
          const keySequence = [...latitude, ...enterSeq, ...longitude]
          return {
            type: "PUSH_ITEM",
            items: keySequence.reduce(onOffInputReducer, []),
          }
        },
        { to: "deque" }
      ),
      incrementAMPCDWaypoint: send(
        {
          type: "PUSH_ITEM",
          items: nextWyptSeq.reduce(onOffInputReducer, []),
        },
        { to: "deque" }
      ),
      incrementWaypointCounter: assign(({ currentWaypoint }) => ({
        currentWaypoint: currentWaypoint + 1,
      })),
    },
    guards: {
      hasMoreWaypoints: ({ inputPlan, currentWaypoint }) =>
        currentWaypoint < inputPlan.waypoints.length,
    },
  }
)
