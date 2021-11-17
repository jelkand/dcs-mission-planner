import { Box, Code, Heading, Link, List, ListItem, Text, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head } from "blitz"
import React from "react"

const InstallationPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Installation</title>
      </Head>

      <Box>
        <Heading>Installing DCS Mission Planner</Heading>

        <VStack alignItems="start" spacing="4">
          <Text>
            DCS Waypoint Manager requires one folder to be installed to your Saved Game files. These
            files can be found{" "}
            <Link
              href="https://github.com/jelkand/dcs-mission-planner/releases"
              textDecoration="underline"
            >
              here
            </Link>{" "}
            in zip format.
          </Text>
          <Text>
            To install them in the correct place, unzip the folder and add drop the{" "}
            <Code>Scripts</Code> folder into your <Code>Saved Games/DCS</Code> folder.
          </Text>

          <Text>
            You will then have to add a line to your <Code>Export.lua</Code> file to ensure the
            scripts are invoked on startup:
          </Text>

          <Code display="block" whiteSpace="pre">
            {
              "local msnplannerlfs = require('lfs');dofile(msnplannerlfs.writedir()..[[ScriptsMissionPlannerMissionPlanner.export.lua]])"
            }
          </Code>
        </VStack>
      </Box>
    </>
  )
}

// InstallationPage.authenticate = true
InstallationPage.getLayout = (page) => <Layout>{page}</Layout>

export default InstallationPage
