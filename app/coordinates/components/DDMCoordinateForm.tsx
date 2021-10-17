import Form, { FormProps } from "app/core/components/Form"
import React from "react"
import { z } from "zod"

import { CoordinateFields } from "./CoordinateFields"

export const DDMCoordinateForm = <S extends z.ZodType<any, any>>(props: FormProps<S>) => (
  <Form<S> {...props}>
    <CoordinateFields name="coordinate" label="coordinate" />
  </Form>
)
