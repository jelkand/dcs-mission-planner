import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteCoordinate = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteCoordinate),
  // resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const coordinate = await db.coordinate.deleteMany({ where: { id } })

    return coordinate
  }
)
