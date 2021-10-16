import { Button } from "@chakra-ui/button"
import { AddIcon } from "@chakra-ui/icons"
import { Box, Heading } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getWaypointSets from "app/waypoint-sets/queries/getWaypointSets"
import { BlitzPage, Head, Link, Routes, usePaginatedQuery, useRouter } from "blitz"
import { format } from "date-fns"
import { Suspense } from "react"

const ITEMS_PER_PAGE = 100

export const WaypointSetsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ waypointSets, hasMore }] = usePaginatedQuery(getWaypointSets, {
    orderBy: { createdAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Waypoint Set</Th>
            <Th isNumeric>Waypoints</Th>
            <Th>Created On</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {waypointSets.map((waypointSet) => (
            <Tr key={waypointSet.id}>
              <Td>{waypointSet.name}</Td>
              <Td>{waypointSet._count?.waypoints}</Td>
              <Td>{format(waypointSet.createdAt, "yyyy-MM-dd")}</Td>
              <Td>
                <Button>
                  <Link href={Routes.ShowWaypointSetPage({ waypointSetId: waypointSet.id })}>
                    <a>View</a>
                  </Link>
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box display="flex" justifyContent="space-around" marginTop="6">
        <Button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </Button>
      </Box>
    </Box>
  )
}

const WaypointSetsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>WaypointSets</title>
      </Head>

      <Box>
        <Heading marginBottom="6">Waypoint Sets</Heading>
        <Button>
          <AddIcon marginRight="2" />
          <Link href={Routes.NewWaypointSetPage()}>
            <a>Create New</a>
          </Link>
        </Button>

        <Suspense fallback={<Box>Loading...</Box>}>
          <WaypointSetsList />
        </Suspense>
      </Box>
    </>
  )
}

// WaypointSetsPage.authenticate = false
WaypointSetsPage.getLayout = (page) => <Layout>{page}</Layout>

export default WaypointSetsPage
