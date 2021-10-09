import { resolver } from "blitz"
import db, { ElevationUnit } from "db"
import { z } from "zod"

const CreateCoordinate = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  elevation: z.number().int(),
  elevationUnit: z.nativeEnum(ElevationUnit),
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
