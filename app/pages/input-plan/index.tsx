import { Button } from "@chakra-ui/button"
import { Box, Heading, VStack } from "@chakra-ui/layout"
import { Select } from "@chakra-ui/select"
import Layout from "app/core/layouts/Layout"
import { WaypointTable } from "app/waypoint-sets/components/WaypointTable"
import getWaypointSet from "app/waypoint-sets/queries/getWaypointSet"
import getWaypointSets from "app/waypoint-sets/queries/getWaypointSets"
import { BlitzPage, Head, Link, Routes, usePaginatedQuery, useQuery, useRouter } from "blitz"
import React, { Suspense } from "react"

const ITEMS_PER_PAGE = 100

export const InputPlanForm = () => {
  const router = useRouter()
  const waypointSetId = Number(router.query.waypointSetId) || undefined

  return (
    <Box>
      <VStack spacing="md">
        <Heading as="h2" size="lg">
          Waypoints
        </Heading>
        <Box>
          {waypointSetId ? (
            <WaypointSetDisplay waypointSetId={waypointSetId} />
          ) : (
            <WaypointSetSelector />
          )}
        </Box>
      </VStack>
    </Box>
  )
}

export const WaypointSetDisplay = ({ waypointSetId }: { waypointSetId: number }) => {
  const router = useRouter()
  const [waypointSet] = useQuery(getWaypointSet, { id: waypointSetId })
  return (
    <Box>
      <WaypointTable waypoints={waypointSet.waypoints} />
      <Button onClick={() => router.push({ query: { waypointSetId: undefined } })}>Clear</Button>
    </Box>
  )
}

export const WaypointSetSelector = () => {
  const router = useRouter()

  const [{ waypointSets }] = usePaginatedQuery(getWaypointSets, {
    orderBy: { createdAt: "desc" },
    take: ITEMS_PER_PAGE,
  })

  return (
    <Select
      placeholder="Select Waypoint Set"
      onChange={(event) => router.push({ query: { waypointSetId: event.target.value } })}
    >
      {waypointSets.map((waypointSet) => (
        <option key={waypointSet.id} value={waypointSet.id}>
          {waypointSet.name}
        </option>
      ))}
    </Select>
  )
}

const InputPlansPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>InputPlans</title>
      </Head>

      <Box>
        <Heading>Build Input Plan</Heading>

        <Suspense fallback={<Box>Loading...</Box>}>
          <InputPlanForm />
        </Suspense>
      </Box>
    </>
  )
}

// InputPlansPage.authenticate = true
InputPlansPage.getLayout = (page) => <Layout>{page}</Layout>

export default InputPlansPage
