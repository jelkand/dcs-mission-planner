import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteWaypointSet = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteWaypointSet),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const waypointSet = await db.waypointSet.deleteMany({ where: { id } })

    return waypointSet
  }
)
