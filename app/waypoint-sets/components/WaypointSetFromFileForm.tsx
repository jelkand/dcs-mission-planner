import { CombatFliteFileField } from "app/combatFlite/components/CombatFliteFileField"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
export { FORM_ERROR } from "app/core/components/Form"
import React from "react"
import { z } from "zod"

export function WaypointSetFromFileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <CombatFliteFileField
        label="CombatFlite File"
        accept=".xml"
        name="waypointSetFile"
        placeholder="Select File"
      />
    </Form>
  )
}
