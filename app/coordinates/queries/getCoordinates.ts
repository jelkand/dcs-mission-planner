import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetCoordinatesInput
  extends Pick<Prisma.CoordinateFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCoordinatesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: coordinates,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.coordinate.count({ where }),
      query: (paginateArgs) => db.coordinate.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      coordinates,
      nextPage,
      hasMore,
      count,
    }
  }
)
