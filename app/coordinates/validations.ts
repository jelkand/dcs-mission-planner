import { ElevationUnit } from "db"
import { z } from "zod"

import { Direction } from "./Direction"

export const Coordinate = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  elevation: z.number(), // todo refactor to int
  elevationUnit: z.nativeEnum(ElevationUnit),
})

export const DDMCoordinate = z.object({
  latitude: z.object({
    direction: z.nativeEnum(Direction),
    degrees: z.number().gte(0).lte(90),
    minutes: z.number().gte(0).lt(60),
    decimalMinutes: z.number().gte(0).lt(9999),
  }),
  longitude: z.object({
    direction: z.nativeEnum(Direction),
    degrees: z.number().gte(0).lte(180),
    minutes: z.number().gte(0).lt(60),
    decimalMinutes: z.number().gte(0).lt(9999),
  }),
  elevation: z.number().gte(0).lt(60000),
  elevationUnit: z.nativeEnum(ElevationUnit),
})
