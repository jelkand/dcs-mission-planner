import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCoordinate = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateCoordinate),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const coordinate = await db.coordinate.create({ data: input })

    return coordinate
  }
)
