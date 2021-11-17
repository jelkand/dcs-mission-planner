import { dequeMachine } from "app/core/machines/dequeMachine"
import { ActorRefFrom, assign, createMachine, send, sendParent, spawn } from "xstate"

import { enterSeq, HornetKey, nextWyptSeq, onOffInputReducer, startKeySeq } from "./inputs"

export interface HornetMachineContext {
  inputPlan: {
    waypoints: Array<RawWaypoint>
  }
  currentWaypoint: number
}

export interface RawWaypoint {
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
      type: "START_ENTRY"
    }
  | {
      type: "STOP"
    }
  | {
      type: "READY_FOR_WAYPOINTS"
    }
  | {
      type: "RESET"
    }
  | {
      type: "SET_WAYPOINTS"
      waypoints: Array<RawWaypoint>
    }

export const hornetMachine = createMachine<HornetMachineContext, HornetMachineEvent>(
  {
    id: "hornetMachine",
    initial: "idle",
    context: {
      inputPlan: {
        waypoints: [],
      },
      currentWaypoint: 0,
    },
    on: {
      RESET: {
        target: "idle",
        actions: "clearInputPlan",
      },
    },
    states: {
      idle: {
        on: {
          SET_WAYPOINTS: { actions: "setWaypoints" },
          START_ENTRY: { target: "waypointEntry", cond: "hasWaypoints" },
        },
      },
      waypointEntry: {
        entry: "setCockpitForWaypointEntry",
        initial: "inputWaypoint",
        on: {
          STOP: "idle",
        },
        onDone: "idle",
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
          },
        },
      },
    },
  },
  {
    actions: {
      clearInputPlan: assign((_) => ({
        inputPlan: {
          waypoints: [],
        },
        currentWaypoint: 0,
      })),
      setWaypoints: assign((_, event) => {
        if (event.type !== "SET_WAYPOINTS") return {}
        return {
          inputPlan: {
            waypoints: event.waypoints,
          },
        }
      }),
      setCockpitForWaypointEntry: sendParent({
        type: "PUSH_ITEM",
        items: startKeySeq.reduce(onOffInputReducer, []),
      }),
      inputNextWaypoint: sendParent(({ inputPlan, currentWaypoint }) => {
        const { latitude, longitude } = inputPlan.waypoints[currentWaypoint]!
        const keySequence = [...latitude, ...enterSeq, ...longitude, ...enterSeq]
        return {
          type: "PUSH_ITEM",
          items: keySequence.reduce(onOffInputReducer, []),
        }
      }),
      incrementAMPCDWaypoint: sendParent({
        type: "PUSH_ITEM",
        items: nextWyptSeq.reduce(onOffInputReducer, []),
      }),
      incrementWaypointCounter: assign(({ currentWaypoint }) => ({
        currentWaypoint: currentWaypoint + 1,
      })),
    },
    guards: {
      hasMoreWaypoints: ({ inputPlan, currentWaypoint }) =>
        currentWaypoint < inputPlan.waypoints.length,
      hasWaypoints: ({ inputPlan }) => !!inputPlan.waypoints.length,
    },
  }
)
