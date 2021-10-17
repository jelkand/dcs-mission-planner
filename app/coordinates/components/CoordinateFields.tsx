import { Box, Stack } from "@chakra-ui/layout"
import { InlineTextField } from "app/core/components/InlineTextField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { SelectField } from "app/core/components/SelectField"
import { ElevationUnit } from "db"
import React from "react"
import { useFormState } from "react-final-form"
import { z } from "zod"

import { Direction } from "../Direction"

const CoordinateDecoration = ({ children }: { children: React.ReactNode }) => (
  <Box as="span" borderBottom="1px" borderColor="inherit" paddingRight="2">
    {children}
  </Box>
)

export const AngularCoordinateFields = ({
  type,
  name,
}: {
  type: "latitude" | "longitude"
  name: string
}) => (
  <Box display="flex">
    <SelectField name={`${name}.${type}.direction`} w="16" variant="flushed">
      {" "}
      {(type === "latitude" ? [Direction.N, Direction.S] : [Direction.E, Direction.W]).map(
        (direction) => (
          <option key={direction} value={direction}>
            {direction}
          </option>
        )
      )}
    </SelectField>
    <InlineTextField
      name={`${name}.${type}.degrees`}
      placeholder="00"
      type="number"
      rightElementChildren={<CoordinateDecoration>°</CoordinateDecoration>}
      w="8"
      variant="flushed"
      labelProps={{ marginRight: "unset" }}
      textAlign="center"
      max={type === "latitude" ? 90 : 180}
      hideErrors
    />
    <InlineTextField
      name={`${name}.${type}.minutes`}
      placeholder="00"
      type="number"
      max={60}
      rightElementChildren={
        <CoordinateDecoration>
          <Box lineHeight="39px">.</Box>
        </CoordinateDecoration>
      }
      w="8"
      variant="flushed"
      labelProps={{ marginRight: "unset" }}
      textAlign="center"
      hideErrors
    />
    <InlineTextField
      name={`${name}.${type}.decimalMinutes`}
      placeholder="0000"
      type="number"
      rightElementChildren={<CoordinateDecoration>{'"'}</CoordinateDecoration>}
      w="10"
      variant="flushed"
      labelProps={{ marginRight: "unset" }}
      textAlign="center"
      max={9999}
      hideErrors
    />
  </Box>
)

export const CoordinateFields = ({ name, label }: { name: string; label: string }) => {
  const { errors, touched } = useFormState()
  console.log({ errors, touched })
  return (
    <Stack direction={["column", "row"]} spacing="32">
      <Box>
        <Box w="48">
          <AngularCoordinateFields name={name} type="latitude" />
          {touched && (
            <div role="alert" style={{ color: "red" }}>
              {/* {errors} */}
            </div>
          )}
          <AngularCoordinateFields name={name} type="longitude" />
        </Box>
      </Box>
      <Box w="48">
        <Box display="flex" justifyContent="space-between">
          <LabeledTextField
            label="Elevation"
            name={`${name}.elevation`}
            type="number"
            variant="flushed"
            max={60000}
          />
          <SelectField name={`${name}.elevationUnit`} variant="flushed" placeholder="Unit">
            {[ElevationUnit.FEET, ElevationUnit.METERS].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </SelectField>
        </Box>
      </Box>
    </Stack>
  )
}
