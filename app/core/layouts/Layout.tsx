import { Box, Container } from "@chakra-ui/layout"
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { Head } from "blitz"
import { ReactNode, useRef } from "react"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const menuBtnRef = useRef(null)
  return (
    <>
      <Head>
        <title>{title || "dcs-mission-planner"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Button ref={menuBtnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button> */}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={menuBtnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>{/* <Input placeholder="Type here..." /> */}</DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Container maxW="container.xl" centerContent>
        <Box padding="4">{children}</Box>
      </Container>
    </>
  )
}

export default Layout
