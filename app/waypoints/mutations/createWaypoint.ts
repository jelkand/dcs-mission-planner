import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateWaypoint = z.object({
  name: z.string(),
  waypointSetId: z.number(),
})

export default resolver.pipe(resolver.zod(CreateWaypoint), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const waypoint = await db.waypoint.create({ data: input })

  return waypoint
})
