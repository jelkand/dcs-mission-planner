import { FileField } from "app/core/components/FileField"
import { Form, FormProps } from "app/core/components/Form"
// import { LabeledTextField } from "app/core/components/LabeledTextField"
import React from "react"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function WaypointSetFromFileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      {/* <LabeledTextField name="name" label="Name" placeholder="Name" /> */}

      <FileField label="Upload from File" accept=".xml" name="waypoint-set-file" />
    </Form>
  )
}
