import { Heading } from "@chakra-ui/layout"
import Layout from "app/core/layouts/Layout"
import {
  FORM_ERROR,
  WaypointSetFromFileForm,
} from "app/waypoint-sets/components/WaypointSetFromFileForm"
import createWaypointSet from "app/waypoint-sets/mutations/createWaypointSet"
import { NewWaypointSetFile } from "app/waypoint-sets/validations"
import { BlitzPage, Link, Routes, useMutation, useRouter } from "blitz"

const NewWaypointSetFromCombatFlitePage: BlitzPage = () => {
  const router = useRouter()
  const [createWaypointSetMutation] = useMutation(createWaypointSet)

  return (
    <div>
      <Heading>Create New Waypoint Set</Heading>

      <WaypointSetFromFileForm
        submitText="Upload CombatFlite File"
        schema={NewWaypointSetFile}
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

// NewWaypointSetPage.authenticate = true
NewWaypointSetFromCombatFlitePage.getLayout = (page) => (
  <Layout title={"Create New WaypointSet"}>{page}</Layout>
)

export default NewWaypointSetFromCombatFlitePage
