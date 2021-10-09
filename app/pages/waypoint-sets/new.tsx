import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createWaypointSet from "app/waypoint-sets/mutations/createWaypointSet"
import { WaypointSetForm, FORM_ERROR } from "app/waypoint-sets/components/WaypointSetForm"

const NewWaypointSetPage: BlitzPage = () => {
  const router = useRouter()
  const [createWaypointSetMutation] = useMutation(createWaypointSet)

  return (
    <div>
      <h1>Create New WaypointSet</h1>

      <WaypointSetForm
        submitText="Create WaypointSet"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateWaypointSet}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const waypointSet = await createWaypointSetMutation(values)
            router.push(Routes.ShowWaypointSetPage({ waypointSetId: waypointSet.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.WaypointSetsPage()}>
          <a>WaypointSets</a>
        </Link>
      </p>
    </div>
  )
}

NewWaypointSetPage.authenticate = true
NewWaypointSetPage.getLayout = (page) => <Layout title={"Create New WaypointSet"}>{page}</Layout>

export default NewWaypointSetPage
