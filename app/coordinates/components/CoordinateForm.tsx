import { NumberInput } from "@chakra-ui/number-input"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function CoordinateForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <NumberInput />
      <NumberInput />
      <NumberInput />

      <LabeledTextField name="name" label="Name" placeholder="Name" />
    </Form>
  )
}
