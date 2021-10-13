import React, { Suspense } from "react"
import { Image, Link, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { CoordinateForm } from "app/coordinates/components/CoordinateForm"
import { DDMCoordinateForm } from "app/coordinates/components/DDMCoordinateForm"
import { toDDM } from "app/coordinates/transformers"
import { Direction } from "app/coordinates/Direction"
import Form from "app/core/components/Form"
import { z } from "zod"
import { InlineTextField } from "app/core/components/InlineTextField"
import { HStack, Box } from "@chakra-ui/layout"
import { CoordinateFields, DDMCoordinate } from "app/coordinates/components/CoordinateFields"

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
