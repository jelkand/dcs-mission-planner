import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GetWaypoint = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetWaypoint), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const waypoint = await db.waypoint.findFirst({ where: { id } })

  if (!waypoint) throw new NotFoundError()

  return waypoint
})
