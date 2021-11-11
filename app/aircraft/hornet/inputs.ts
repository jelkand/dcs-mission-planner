import { SendMessage } from "app/core/machines/dequeMachine"
import { DCSMessage, InputMessage } from "app/dcsIntegration/messageTypes"

const LONG_DELAY = 500
const SHORT_DELAY = 200
const NO_DELAY = 50

export interface Input {
  deviceId: number
  inputId: number
  onValue: number
  offValue: number
  releaseDelay: number
}

type inputSequence = Array<keyof typeof hornetInputs>

export const inputStringToSocketMessage = ({
  key,
  targetState = "on",
}: {
  key: HornetKey
  targetState?: "on" | "off"
}): SendMessage => {
  const { onValue, offValue, releaseDelay, ...rest } = hornetInputs[key]
  const targetValue = targetState === "on" ? onValue : offValue
  return {
    type: "SEND_MESSAGE",
    message: {
      action: "input",
      payload: {
        value: targetValue,
        ...rest,
      },
    },
    delay: releaseDelay,
  }
}

export const onOffInputReducer = (acc: SendMessage[], current: HornetKey) => {
  const on = inputStringToSocketMessage({ key: current, targetState: "on" })
  const off = inputStringToSocketMessage({ key: current, targetState: "off" })
  return [...acc, on, off]
}

export const startKeySeq: inputSequence = ["DATA", "UFC", "POSN"]
export const enterSeq: inputSequence = ["ENT"]
export const nextWyptSeq: inputSequence = ["WYPTUP", "UFC", "POSN"]

export const hornetInputs: Record<HornetKey, Input> = {
  N: {
    deviceId: 25,
    inputId: 3020,
    onValue: 1,
    offValue: 0,
    releaseDelay: LONG_DELAY,
  },
  E: {
    deviceId: 25,
    inputId: 3024,
    onValue: 1,
    offValue: 0,
    releaseDelay: LONG_DELAY,
  },
  S: {
    deviceId: 25,
    inputId: 3026,
    onValue: 1,
    offValue: 0,
    releaseDelay: LONG_DELAY,
  },
  W: {
    deviceId: 25,
    inputId: 3022,
    onValue: 1,
    offValue: 0,
    releaseDelay: LONG_DELAY,
  },
  1: {
    deviceId: 25,
    inputId: 3019,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  2: {
    deviceId: 25,
    inputId: 3020,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  3: {
    deviceId: 25,
    inputId: 3021,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  4: {
    deviceId: 25,
    inputId: 3022,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  5: {
    deviceId: 25,
    inputId: 3023,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  6: {
    deviceId: 25,
    inputId: 3024,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  7: {
    deviceId: 25,
    inputId: 3025,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  8: {
    deviceId: 25,
    inputId: 3026,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  9: {
    deviceId: 25,
    inputId: 3027,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  0: {
    deviceId: 25,
    inputId: 3018,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  ENT: {
    deviceId: 25,
    inputId: 3029,
    onValue: 1,
    offValue: 0,
    releaseDelay: LONG_DELAY,
  },
  POSN: {
    deviceId: 25,
    inputId: 3010,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  WYPTUP: {
    deviceId: 37,
    inputId: 3022,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  WYPTDWN: {
    deviceId: 37,
    inputId: 3023,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  DATA: {
    deviceId: 37,
    inputId: 3020,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
  UFC: {
    deviceId: 37,
    inputId: 3015,
    onValue: 1,
    offValue: 0,
    releaseDelay: SHORT_DELAY,
  },
}

export type HornetKey =
  | "N"
  | "E"
  | "S"
  | "W"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "0"
  | "ENT"
  | "POSN"
  | "WYPTUP"
  | "WYPTDWN"
  | "DATA"
  | "UFC"
