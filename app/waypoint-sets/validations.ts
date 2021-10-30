import { Coordinate, DDMCoordinate } from "app/coordinates/validations"
import { z } from "zod"

export const NewWaypointSet = z.object({
  name: z.string().nonempty(),
  waypoints: z.array(
    z.object({
      elementOrder: z.number().nonnegative(),
      sequenceNum: z.number().gte(1).lte(3).optional(),
      waypoint: z.object({
        name: z.string().nonempty(),
        coordinate: DDMCoordinate,
      }),
    })
  ),
})

export const NewWaypointSetFile = z.object({
  name: z.string().nonempty(),
  waypointSetFile: z.object({
    fileName: z.string(),
    waypointSet: z.object({
      waypoints: z.array(
        z.object({
          elementOrder: z.number().nonnegative(),
          sequenceNum: z.number().gte(1).lte(3).optional(),
          waypoint: z.object({
            name: z.string().nonempty(),
            coordinate: Coordinate,
          }),
        })
      ),
    }),
  }),
})
