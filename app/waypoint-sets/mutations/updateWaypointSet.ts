import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateWaypointSet = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateWaypointSet),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const waypointSet = await db.waypointSet.update({ where: { id }, data })

    return waypointSet
  }
)
