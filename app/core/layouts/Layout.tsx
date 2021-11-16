import { Box, Container, Text } from "@chakra-ui/layout"
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react"
import { useSelector } from "@xstate/react"
import { DcsIntegrationContext } from "app/contexts/dcsIntegrationProvider"
import { Head } from "blitz"
import React, { ReactNode, useContext, useRef } from "react"

type LayoutProps = {
  title?: string
  children: ReactNode
}

export const readySelector = (state) => {
  return state.context.socketRef.state.matches("open.ready")
}

const hornetStateSelector = (state) => {
  return state.context.aircraftRef.state.value
}
const dequeStateSelector = (state) => {
  return state.context.dequeRef.state.value
}
const dequeSelector = (state) => {
  return state.context.dequeRef.state.context.deque
}
const hornetWaypointSelector = (state) => {
  return state.context.aircraftRef.state.context
}

const Layout = ({ title, children }: LayoutProps) => {
  const { inputPlanIsOpen, inputPlanOnClose, inputPlanOnOpen, missionPlannerService } =
    useContext(DcsIntegrationContext)
  const menuBtnRef = useRef(null)

  const dcsConnectionIsReady = useSelector(missionPlannerService, readySelector)
  const hornetMachineState = useSelector(missionPlannerService, hornetStateSelector)
  const hwp = useSelector(missionPlannerService, hornetWaypointSelector)
  const dequeState = useSelector(missionPlannerService, dequeStateSelector)
  const deque = useSelector(missionPlannerService, dequeSelector)
  return (
    <>
      <Head>
        <title>{title || "dcs-mission-planner"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button ref={menuBtnRef} colorScheme="teal" onClick={inputPlanOnOpen}>
        Open
      </Button>

      <Drawer
        isOpen={inputPlanIsOpen}
        placement="bottom"
        onClose={inputPlanOnClose}
        finalFocusRef={menuBtnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Running input plan...</DrawerHeader>

          <DrawerBody>
            <Box>Hornet State: {hornetMachineState}</Box>
            <Box>Hornet wp: {JSON.stringify(hwp)}</Box>
            <Box>Deque State: {dequeState}</Box>
            <Box>Deque: {JSON.stringify(deque)}</Box>
          </DrawerBody>

          <DrawerFooter>
            {/* <Button variant="outline" mr={3} onClick={inputPlanOnClose}>
              Cancel
            </Button> */}
            <Button colorScheme="red" onClick={() => missionPlannerService.send("RESET")}>
              RESET
            </Button>
            <Button colorScheme="blue" onClick={() => missionPlannerService.send("START_ENTRY")}>
              Start
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Container maxW="container.xl" centerContent>
        <Box padding="4">{children}</Box>
      </Container>

      <Box bottom="0" position="fixed" width="100%">
        <Container maxW="container.xl" centerContent>
          <Text>DCS Connection Status: {dcsConnectionIsReady ? "READY" : "NOT CONNECTED"}</Text>
        </Container>
      </Box>
    </>
  )
}

export default Layout
