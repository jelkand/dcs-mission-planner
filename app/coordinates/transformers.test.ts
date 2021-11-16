import { toMatchCloseTo } from "jest-matcher-deep-close-to"
expect.extend({ toMatchCloseTo })
import { Direction } from "./Direction"
import {
  ddmToDecimalValue,
  decimalCoordToInputCoord,
  decimalValueToDDM,
  decimalValueToInputString,
  toDDM,
} from "./transformers"

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

  it("converts a decimal degree to an array of inputs", () => {
    const initialCoordinate = {
      latitude: -77.508333,
      longitude: 164.754167,
    }

    const expected = {
      latitude: ["S", "7", "7", "3", "0", "5", "0"],
      longitude: ["E", "1", "6", "4", "4", "5", "2", "5"],
    }
    const actual = decimalCoordToInputCoord(initialCoordinate)

    expect(actual).toStrictEqual(expected)
  })

  it("correctly pad inputs when the minutes have a leading 0", () => {
    const mockLat = {
      direction: Direction.N,
      degrees: 5,
      minutes: 4.52,
    }
    const mockLong = {
      direction: Direction.E,
      degrees: 2,
      minutes: 2.52,
    }

    const initialCoordinate = {
      latitude: ddmToDecimalValue(mockLat),
      longitude: ddmToDecimalValue(mockLong),
    }

    const expected = {
      latitude: ["N", "5", "0", "4", "5", "2"],
      longitude: ["E", "2", "0", "2", "5", "2"],
    }
    const actual = decimalCoordToInputCoord(initialCoordinate)

    expect(actual).toStrictEqual(expected)
  })
})
