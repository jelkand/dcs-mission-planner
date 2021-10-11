import { Coordinate } from "db"
import { DDMCoordinate, Direction, toDDM } from "./transformers"

describe("Coordinate Transformers", () => {
  it("Converts a decimal degree coordinate to DDM", () => {
    const initialCoordinate = {
      latitude: -77.508333,
      longitude: 164.754167,
    }

    const expected: DDMCoordinate = {
      latitude: {
        direction: Direction.S,
        degrees: 77,
        minutes: 30,
        decimalMinutes: 5000,
      },
      longitude: {
        direction: Direction.E,
        degrees: 164,
        minutes: 45,
        decimalMinutes: 2500,
      },
    }

    const actual = toDDM(initialCoordinate)

    expect(actual).toStrictEqual(expected)
  })
})
