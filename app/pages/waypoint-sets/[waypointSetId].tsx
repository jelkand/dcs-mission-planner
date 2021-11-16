import { Heading } from "@chakra-ui/layout"
import { Button, ButtonGroup } from "@chakra-ui/react"
import { DcsIntegrationContext } from "app/contexts/dcsIntegrationProvider"
import { decimalCoordToInputCoord } from "app/coordinates/transformers"
import Layout from "app/core/layouts/Layout"
import { WaypointTable } from "app/waypoint-sets/components/WaypointTable"
import deleteWaypointSet from "app/waypoint-sets/mutations/deleteWaypointSet"
import getWaypointSet from "app/waypoint-sets/queries/getWaypointSet"
import { BlitzPage, Head, Link, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import React, { Suspense, useContext } from "react"

export const WaypointSet = () => {
  const waypointSetId = useParam("waypointSetId", "number")
  const { inputPlanOnOpen, missionPlannerService } = useContext(DcsIntegrationContext)
  // const [deleteWaypointSetMutation] = useMutation(deleteWaypointSet)
  const [waypointSet] = useQuery(getWaypointSet, { id: waypointSetId })

  const inputFormattedWaypoints = waypointSet.waypoints.map((wypt) =>
    decimalCoordToInputCoord(wypt.waypoint.coordinate)
  )

  const onEnterToJetClick = () => {
    missionPlannerService.send({ type: "SET_WAYPOINTS", waypoints: inputFormattedWaypoints })
    inputPlanOnOpen()
  }

  return (
    <>
      <Head>
        <Heading>{waypointSet.name}</Heading>
      </Head>

      <div>
        <Heading>{waypointSet.name}</Heading>

        <WaypointTable waypoints={waypointSet.waypoints} />

        <br />

        <ButtonGroup variant="simple" spacing="6">
          {/* <Button>
            <Link href={Routes.EditWaypointSetPage({ waypointSetId: waypointSet.id })}>Edit</Link>
          </Button> */}
          {/* <Button
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteWaypointSetMutation({ id: waypointSet.id })
                router.push(Routes.WaypointSetsPage())
              }
            }}
            colorScheme="red"
          >
            Delete
          </Button> */}

          <Button variant="solid" onClick={onEnterToJetClick}>
            {/* <Link href={Routes.InputPlansPage({ waypointSetId: waypointSet.id })}> */}
            Enter to Jet
            {/* </Link> */}
          </Button>
        </ButtonGroup>
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

// ShowWaypointSetPage.authenticate = true
ShowWaypointSetPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWaypointSetPage
