import { Heading, Link as ChakraLink } from "@chakra-ui/layout"
import Layout from "app/core/layouts/Layout"
// import { DcsSocketIntegration } from "app/dcsIntegration/components/DcsSocketIntegration"
import { BlitzPage, Link, Routes } from "blitz"
import React from "react"

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Heading>DCS Mission Planner</Heading>
        <Link href={Routes.WaypointSetsPage()}>
          <ChakraLink>Browse Existing Waypoint Sets</ChakraLink>
        </Link>
        <br />
        <Link href={Routes.NewWaypointSetPage()}>
          <ChakraLink>Create New Waypoint Set</ChakraLink>
        </Link>
      </main>

      <footer></footer>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
