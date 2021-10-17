import Layout from "app/core/layouts/Layout"
import { DcsSocketIntegration } from "app/dcsIntegration/components/DcsSocketIntegration"
import { BlitzPage } from "blitz"
import React from "react"

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <DcsSocketIntegration></DcsSocketIntegration>
      </main>

      <footer></footer>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
