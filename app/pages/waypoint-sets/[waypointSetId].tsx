import Layout from "app/core/layouts/Layout"
import deleteWaypointSet from "app/waypoint-sets/mutations/deleteWaypointSet"
import getWaypointSet from "app/waypoint-sets/queries/getWaypointSet"
import { BlitzPage, Head, Link, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import { Suspense } from "react"

export const WaypointSet = () => {
  const router = useRouter()
  const waypointSetId = useParam("waypointSetId", "number")
  const [deleteWaypointSetMutation] = useMutation(deleteWaypointSet)
  const [waypointSet] = useQuery(getWaypointSet, { id: waypointSetId })

  return (
    <>
      <Head>
        <title>WaypointSet {waypointSet.id}</title>
      </Head>

      <div>
        <h1>WaypointSet {waypointSet.id}</h1>
        <pre>{JSON.stringify(waypointSet, null, 2)}</pre>

        <Link href={Routes.EditWaypointSetPage({ waypointSetId: waypointSet.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteWaypointSetMutation({ id: waypointSet.id })
              router.push(Routes.WaypointSetsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowWaypointSetPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.WaypointSetsPage()}>
          <a>WaypointSets</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <WaypointSet />
      </Suspense>
    </div>
  )
}

ShowWaypointSetPage.authenticate = true
ShowWaypointSetPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWaypointSetPage
