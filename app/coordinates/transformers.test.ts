import { toMatchCloseTo } from "jest-matcher-deep-close-to"
expect.extend({ toMatchCloseTo })
import { Direction } from "./Direction"
import { ddmToDecimalValue, decimalValueToDDM, toDDM } from "./transformers"

describe("Coordinate Transformers", () => {
  it("Converts a decimal degree coordinate to DDM", () => {
    const initialCoordinate = {
      latitude: -77.508333,
      longitude: 164.754167,
    }

    const expected = {
      latitude: {
        direction: Direction.S,
        degrees: 77,
        minutes: 30.5,
      },
      longitude: {
        direction: Direction.E,
        degrees: 164,
        minutes: 45.25,
      },
    }

    const actual = toDDM(initialCoordinate)

    expect(actual).toMatchCloseTo(expected, 4)
  })

  it("converts a DDM value to a decimal", () => {
    const input = {
      direction: Direction.S,
      degrees: 77,
      minutes: 30.5,
    }

    const expected = -77.508333
    const actual = ddmToDecimalValue(input)

    expect(actual).toBeCloseTo(expected)
  })
})
