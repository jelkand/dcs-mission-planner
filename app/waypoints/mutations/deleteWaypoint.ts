import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteWaypoint = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteWaypoint), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const waypoint = await db.waypoint.deleteMany({ where: { id } })

  return waypoint
})
