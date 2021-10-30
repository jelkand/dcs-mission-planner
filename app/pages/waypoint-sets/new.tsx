import { Heading } from "@chakra-ui/layout"
import Layout from "app/core/layouts/Layout"
import {
  FORM_ERROR,
  WaypointSetFromFileForm,
} from "app/waypoint-sets/components/WaypointSetFromFileForm"
import createWaypointSet from "app/waypoint-sets/mutations/createWaypointSet"
// import { CombatFliteSchema } from "app/waypoint-sets/transformers"
import { NewWaypointSet } from "app/waypoint-sets/validations"
import { BlitzPage, Link, Routes, useMutation, useRouter } from "blitz"
import parser from "fast-xml-parser"

const NewWaypointSetPage: BlitzPage = () => {
  const router = useRouter()
  const [createWaypointSetMutation] = useMutation(createWaypointSet)

  return (
    <div>
      <Heading>Create New Waypoint Set</Heading>

      <WaypointSetFromFileForm
        submitText="Create WaypointSet"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        schema={NewWaypointSet}
        // initialValues={{}}
        // onChange={console.log}
        onSubmit={async (values) => {
          try {
            console.log(values)
            // const fr = new FileReader()
            // await fr.readAsText(values["waypoint-set-file"][0])
            // const text = await values["waypoint-set-file"][0].text()
            // console.log({ text })
            // const val = parser.validate(text)
            // console.log({ val })
            // const json = parser.parse(text, {}, true)
            // console.log(CombatFliteSchema.parse(json))
            // console.log({ json })
            // const waypointSet = await createWaypointSetMutation(values)
            // router.push(Routes.ShowWaypointSetPage({ waypointSetId: waypointSet.id }))
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
NewWaypointSetPage.getLayout = (page) => <Layout title={"Create New WaypointSet"}>{page}</Layout>

export default NewWaypointSetPage
