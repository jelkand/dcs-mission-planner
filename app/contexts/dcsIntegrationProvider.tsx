import { useDisclosure } from "@chakra-ui/react"
import { useInterpret } from "@xstate/react"
import { missionPlannerMachine } from "app/core/machines/missionPlannerMachine"
import React, { createContext } from "react"
import { ActorRefFrom, Interpreter } from "xstate"

interface DcsIntegrationContext {
  missionPlannerService: ActorRefFrom<typeof missionPlannerMachine>
  inputPlanIsOpen: boolean
  inputPlanOnOpen: () => void
  inputPlanOnClose: () => void
}

export const DcsIntegrationContext = createContext<DcsIntegrationContext>(
  {} as DcsIntegrationContext
)

export const DcsIntegrationProvider: React.FC = (props) => {
  const missionPlannerService = useInterpret(missionPlannerMachine)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <DcsIntegrationContext.Provider
      value={{
        missionPlannerService,
        inputPlanIsOpen: isOpen,
        inputPlanOnOpen: onOpen,
        inputPlanOnClose: onClose,
      }}
    >
      {props.children}
    </DcsIntegrationContext.Provider>
  )
}
