import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GetWaypointSet = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetWaypointSet),
  // resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const waypointSet = await db.waypointSet.findFirst({
      where: { id },
      include: {
        waypoints: {
          orderBy: { elementOrder: "asc" },
          include: {
            waypoint: { include: { coordinate: true } },
          },
        },
      },
    })

    if (!waypointSet) throw new NotFoundError()

    return waypointSet
  }
)
