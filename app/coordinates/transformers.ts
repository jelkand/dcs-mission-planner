import { Coordinate } from "db"

export enum Direction {
  N,
  E,
  S,
  W,
}

interface DDM {
  direction: Direction
  degrees: number
  minutes: number
  decimalMinutes: number
}

interface DDMLatitude extends DDM {
  direction: Direction.N | Direction.S
}

interface DDMLongitude extends DDM {
  direction: Direction.E | Direction.W
}

export interface DDMCoordinate {
  latitude: DDMLatitude
  longitude: DDMLongitude
}

// TODO: Refactor to infer northing/easting based on generics
export const decimalValueToDDM = (decimalDegrees: number, isNorthing: boolean): DDM => {
  const directions: [Direction, Direction] = isNorthing
    ? [Direction.N, Direction.S]
    : [Direction.E, Direction.W]
  const degreesDirection = decimalDegrees > 0 ? directions[0] : directions[1]
  const degreesMagnitude = Math.abs(decimalDegrees)

  const degrees = Math.trunc(degreesMagnitude)
  const minutes = (degreesMagnitude % 1) * 60

  const wholeMinutes = Math.trunc(minutes)

  const decimalMinutes = Math.trunc(Math.round((minutes % 1) * 10000))

  return {
    direction: degreesDirection,
    degrees,
    minutes: wholeMinutes,
    decimalMinutes,
  }
}

export const toDDM = ({
  latitude: decimalLat,
  longitude: decimalLong,
}: Pick<Coordinate, "latitude" | "longitude">): DDMCoordinate => {
  const latitude = decimalValueToDDM(decimalLat, true) as DDMLatitude
  const longitude = decimalValueToDDM(decimalLong, false) as DDMLongitude

  return { latitude, longitude }
}
