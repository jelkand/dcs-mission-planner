import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

import { NewWaypointSetFile } from "../validations"

export const formToPrisma = ({ name, waypointSetFile }: z.infer<typeof NewWaypointSetFile>) => ({
  name,
  waypoints: {
    create: waypointSetFile.waypointSet.waypoints.map(({ elementOrder, waypoint }) => ({
      elementOrder,
      waypoint: {
        create: {
          name: waypoint.name,
          coordinate: {
            create: {
              ...waypoint.coordinate,
            },
          },
        },
      },
    })),
  },
})

export default resolver.pipe(
  resolver.zod(NewWaypointSetFile),
  // resolver.authorize(),
  async (input) => {
    console.log({ input })
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const waypointSet = await db.waypointSet.create({
      data: formToPrisma(input),
    })

    return waypointSet
  }
)
