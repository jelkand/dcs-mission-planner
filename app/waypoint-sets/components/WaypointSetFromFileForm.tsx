import { Button } from "@chakra-ui/button"
import { Box } from "@chakra-ui/layout"
import { CoordinateFields } from "app/coordinates/components/CoordinateFields"
import { DDMCoordinateForm } from "app/coordinates/components/DDMCoordinateForm"
import { FileField } from "app/core/components/FileField"
import { Form, FormProps } from "app/core/components/Form"
import { FormDebug } from "app/core/components/FormDebug"
import { LabeledTextField } from "app/core/components/LabeledTextField"
export { FORM_ERROR } from "app/core/components/Form"
import arrayMutators from "final-form-arrays"
import React from "react"
import { FieldArray } from "react-final-form-arrays"
import { z } from "zod"

export function WaypointSetFromFileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> mutators={{ ...arrayMutators }} {...props}>
      {/* <FileField
        label="Prepopulate from File"
        accept=".xml"
        name="waypoint-set-file"
        placeholder="Select File"
      /> */}
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <FieldArray name="waypoints">
        {({ fields, meta }) => (
          <Box>
            {fields.map((name, index) => (
              <Box
                key={name}
                border="1px solid"
                borderRadius="2px"
                padding="2"
                borderColor="inherit"
                my="2"
              >
                <LabeledTextField
                  name={`${name}.waypoint.name`}
                  label="Waypoint Name"
                  placeholder="Waypoint Name"
                />
                <CoordinateFields name={`${name}.waypoint.coordinate`} label={"label"} />
              </Box>
            ))}
            <Button onClick={() => fields.push({ waypoint: {}, elementOrder: fields.length })}>
              Add Waypoint
            </Button>
          </Box>
        )}
      </FieldArray>
      <Box>
        <FormDebug />
      </Box>
    </Form>
  )
}

const WaypointField = () => {}
