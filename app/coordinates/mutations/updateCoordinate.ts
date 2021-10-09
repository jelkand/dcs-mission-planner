import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCoordinate = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateCoordinate),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const coordinate = await db.coordinate.update({ where: { id }, data })

    return coordinate
  }
)
