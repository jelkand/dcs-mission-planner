import { resolver } from "blitz"
import db, { ElevationUnit } from "db"
import { z } from "zod"

const UpdateCoordinate = z.object({
  id: z.number(),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  elevation: z.number().int(),
  elevationUnit: z.nativeEnum(ElevationUnit),
})

export default resolver.pipe(
  resolver.zod(UpdateCoordinate),
  // resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const coordinate = await db.coordinate.update({ where: { id }, data })

    return coordinate
  }
)
