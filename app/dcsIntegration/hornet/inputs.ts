const LONG_DELAY = 0.5
const SHORT_DELAY = 0.2
const NO_DELAY = 0.05

export interface Input {
  deviceId: number
  inputId: number
  onValue: number
  offValue: number
  releaseDelay: number
}

export const hornetInputs: Record<string, Input> = {
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
