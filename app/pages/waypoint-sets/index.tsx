import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWaypointSets from "app/waypoint-sets/queries/getWaypointSets"

const ITEMS_PER_PAGE = 100

export const WaypointSetsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ waypointSets, hasMore }] = usePaginatedQuery(getWaypointSets, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {waypointSets.map((waypointSet) => (
          <li key={waypointSet.id}>
            <Link href={Routes.ShowWaypointSetPage({ waypointSetId: waypointSet.id })}>
              <a>{waypointSet.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const WaypointSetsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>WaypointSets</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewWaypointSetPage()}>
            <a>Create WaypointSet</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <WaypointSetsList />
        </Suspense>
      </div>
    </>
  )
}

WaypointSetsPage.authenticate = false
WaypointSetsPage.getLayout = (page) => <Layout>{page}</Layout>

export default WaypointSetsPage
