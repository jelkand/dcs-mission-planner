import { Heading } from "@chakra-ui/layout"
import { Button, ButtonGroup, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import deleteWaypointSet from "app/waypoint-sets/mutations/deleteWaypointSet"
import getWaypointSet from "app/waypoint-sets/queries/getWaypointSet"
import { BlitzPage, Head, Link, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import React, { Suspense } from "react"

export const WaypointSet = () => {
  const router = useRouter()
  const waypointSetId = useParam("waypointSetId", "number")
  const [deleteWaypointSetMutation] = useMutation(deleteWaypointSet)
  const [waypointSet] = useQuery(getWaypointSet, { id: waypointSetId })

  return (
    <>
      <Head>
        <title>{waypointSet.name}</title>
      </Head>

      <div>
        <Heading>{waypointSet.name}</Heading>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Index</Th>
              <Th>Waypoint</Th>
              <Th>Latitude</Th>
              <Th>Longitude</Th>
              <Th>Elevation</Th>
            </Tr>
          </Thead>
          <Tbody>
            {waypointSet.waypoints.map(({ id, waypoint, elementOrder }) => (
              <Tr key={id}>
                <Td>{elementOrder}</Td>
                <Td>{waypoint.name}</Td>
                <Td>{waypoint.coordinate.latitude}</Td>
                <Td>{waypoint.coordinate.longitude}</Td>
                <Td>
                  {waypoint.coordinate.elevation} {waypoint.coordinate.elevationUnit}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <ButtonGroup variant="simple" spacing="6">
          <Button>
            <Link href={Routes.EditWaypointSetPage({ waypointSetId: waypointSet.id })}>Edit</Link>
          </Button>
          <Button
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteWaypointSetMutation({ id: waypointSet.id })
                router.push(Routes.WaypointSetsPage())
              }
            }}
            colorScheme="red"
          >
            Delete
          </Button>

          <Button>Enter to Jet</Button>
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
