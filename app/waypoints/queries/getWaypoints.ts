import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetWaypointsInput
  extends Pick<Prisma.WaypointFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  // resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetWaypointsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: waypoints,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.waypoint.count({ where }),
      query: (paginateArgs) => db.waypoint.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      waypoints,
      nextPage,
      hasMore,
      count,
    }
  }
)
