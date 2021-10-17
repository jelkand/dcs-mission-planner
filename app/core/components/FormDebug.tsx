import { Code } from "@chakra-ui/layout"
import { useFormState } from "react-final-form"

export const FormDebug = () => {
  const data = useFormState()

  return <Code>{JSON.stringify(data.values, undefined, 2)}</Code>
}
