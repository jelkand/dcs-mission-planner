import { DCSMessage } from "app/dcsIntegration/messageTypes"

import { onOffInputReducer, startKeySeq } from "./inputs"

describe("Hornet Inputs", () => {
  it("should generate a list of messages to start waypoint entry", () => {
    const expected = [
      {
        delay: 200,
        message: { action: "input", payload: { deviceId: 37, inputId: 3020, value: 1 } },
        type: "SEND_MESSAGE",
      },
      {
        delay: 200,
        message: { action: "input", payload: { deviceId: 37, inputId: 3020, value: 0 } },
        type: "SEND_MESSAGE",
      },
      {
        delay: 200,
        message: { action: "input", payload: { deviceId: 37, inputId: 3015, value: 1 } },
        type: "SEND_MESSAGE",
      },
      {
        delay: 200,
        message: { action: "input", payload: { deviceId: 37, inputId: 3015, value: 0 } },
        type: "SEND_MESSAGE",
      },
      {
        delay: 200,
        message: { action: "input", payload: { deviceId: 25, inputId: 3010, value: 1 } },
        type: "SEND_MESSAGE",
      },
      {
        delay: 200,
        message: { action: "input", payload: { deviceId: 25, inputId: 3010, value: 0 } },
        type: "SEND_MESSAGE",
      },
    ]

    const actual = startKeySeq.reduce(onOffInputReducer, [])
    expect(actual).toStrictEqual(expected)
  })
})
