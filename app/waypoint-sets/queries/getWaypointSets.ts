import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetWaypointSetsInput
  extends Pick<Prisma.WaypointSetFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetWaypointSetsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: waypointSets,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.waypointSet.count({ where }),
      query: (paginateArgs) => db.waypointSet.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      waypointSets,
      nextPage,
      hasMore,
      count,
    }
  }
)
