import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateWaypoint = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateWaypoint),
  // resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const waypoint = await db.waypoint.update({ where: { id }, data })

    return waypoint
  }
)
