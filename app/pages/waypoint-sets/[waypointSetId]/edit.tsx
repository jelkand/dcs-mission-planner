import Layout from "app/core/layouts/Layout"
import { FORM_ERROR, WaypointSetForm } from "app/waypoint-sets/components/WaypointSetForm"
import updateWaypointSet from "app/waypoint-sets/mutations/updateWaypointSet"
import getWaypointSet from "app/waypoint-sets/queries/getWaypointSet"
import { BlitzPage, Head, Link, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import { Suspense } from "react"

export const EditWaypointSet = () => {
  const router = useRouter()
  const waypointSetId = useParam("waypointSetId", "number")
  const [waypointSet, { setQueryData }] = useQuery(
    getWaypointSet,
    { id: waypointSetId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateWaypointSetMutation] = useMutation(updateWaypointSet)

  return (
    <>
      <Head>
        <title>Edit WaypointSet {waypointSet.id}</title>
      </Head>

      <div>
        <h1>Edit WaypointSet {waypointSet.id}</h1>
        <pre>{JSON.stringify(waypointSet, null, 2)}</pre>

        <WaypointSetForm
          submitText="Update WaypointSet"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateWaypointSet}
          initialValues={waypointSet}
          onSubmit={async (values) => {
            try {
              const updated = await updateWaypointSetMutation({
                id: waypointSet.id,
                ...values,
              })
              // await setQueryData(updated)
              router.push(Routes.ShowWaypointSetPage({ waypointSetId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditWaypointSetPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditWaypointSet />
      </Suspense>

      <p>
        <Link href={Routes.WaypointSetsPage()}>
          <a>WaypointSets</a>
        </Link>
      </p>
    </div>
  )
}

// EditWaypointSetPage.authenticate = true
EditWaypointSetPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditWaypointSetPage
