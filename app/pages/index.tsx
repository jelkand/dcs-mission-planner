import { Box, HStack } from "@chakra-ui/layout"
import logout from "app/auth/mutations/logout"
import { CoordinateFields, DDMCoordinate } from "app/coordinates/components/CoordinateFields"
import { CoordinateForm } from "app/coordinates/components/CoordinateForm"
import { DDMCoordinateForm } from "app/coordinates/components/DDMCoordinateForm"
import { Direction } from "app/coordinates/Direction"
import { toDDM } from "app/coordinates/transformers"
import Form from "app/core/components/Form"
import { InlineTextField } from "app/core/components/InlineTextField"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Image, Link, Routes, useMutation } from "blitz"
import React, { Suspense } from "react"
import { z } from "zod"

const initialCoord = { latitude: -77.508333, longitude: 164.754167 }

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Form<typeof DDMCoordinate>
          onSubmit={console.log}
          initialValues={toDDM(initialCoord)}
          schema={DDMCoordinate}
          submitText="Save"
        >
          <CoordinateFields />
        </Form>
      </main>

      <footer></footer>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
