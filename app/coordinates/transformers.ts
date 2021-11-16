import { RawWaypoint } from "app/aircraft/hornet/hornetMachine"
import { HornetKey } from "app/aircraft/hornet/inputs"
import { Coordinate } from "db"

import { Direction } from "./Direction"

export const positiveDirections = new Set([Direction.N, Direction.E])

interface DDM {
  direction: Direction
  degrees: number
  minutes: number
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
export const decimalValueToDDM = (decimalDegrees: number, axis: "northing" | "easting"): DDM => {
  const directions: [Direction, Direction] =
    axis === "northing" ? [Direction.N, Direction.S] : [Direction.E, Direction.W]
  const degreesDirection = decimalDegrees > 0 ? directions[0] : directions[1]
  const degreesMagnitude = Math.abs(decimalDegrees)

  const degrees = Math.trunc(degreesMagnitude)
  const minutes = (degreesMagnitude % 1) * 60

  return {
    direction: degreesDirection,
    degrees,
    minutes,
  }
}

export const decimalValueToDDMString = (
  decimalDegrees: number,
  axis: "northing" | "easting"
): string => {
  const { direction, degrees, minutes } = decimalValueToDDM(decimalDegrees, axis)
  return `${direction} ${degrees}° ${minutes.toFixed(4).padStart(7, "0")}`
}

export const decimalValueToInputString = (decimalDegrees: number, axis: "northing" | "easting") => {
  const { direction, degrees, minutes } = decimalValueToDDM(decimalDegrees, axis)
  return [
    direction,
    ...degrees.toString().split(""),
    ...minutes.toFixed(2).replace(".", "").padStart(4, "0").split(""),
  ]
}

export const toDDM = ({
  latitude: decimalLat,
  longitude: decimalLong,
}: Pick<Coordinate, "latitude" | "longitude">): DDMCoordinate => {
  const latitude = decimalValueToDDM(decimalLat, "northing") as DDMLatitude
  const longitude = decimalValueToDDM(decimalLong, "easting") as DDMLongitude

  return { latitude, longitude }
}

export const ddmToDecimalValue = ({ direction, degrees, minutes }: DDM): number => {
  const directionCoefficient = positiveDirections.has(direction) ? 1 : -1
  const decimal = minutes / 60
  return directionCoefficient * (degrees + decimal)
}

export const decimalCoordToInputCoord = ({
  latitude: decimalLat,
  longitude: decimalLong,
}: Pick<Coordinate, "latitude" | "longitude">): RawWaypoint => {
  const latitude = decimalValueToInputString(decimalLat, "northing") as Array<HornetKey>
  const longitude = decimalValueToInputString(decimalLong, "easting") as Array<HornetKey>

  return { latitude, longitude }
}
