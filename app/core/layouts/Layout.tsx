import { ReactNode, useRef } from "react"
import { Head } from "blitz"
import { Box } from "@chakra-ui/layout"
import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
} from "@chakra-ui/react"

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

      <Button ref={menuBtnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>

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

      <Box>{children}</Box>
    </>
  )
}

export default Layout
