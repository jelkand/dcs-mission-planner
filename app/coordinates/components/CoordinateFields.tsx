import { Box, Stack } from "@chakra-ui/layout"
import { InlineTextField } from "app/core/components/InlineTextField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { SelectField } from "app/core/components/SelectField"
import { ElevationUnit } from "db"
import React from "react"
import { z } from "zod"
import { Direction } from "../Direction"

export const DDMCoordinate = z.object({
  latitude: z.object({
    direction: z.nativeEnum(Direction),
    degrees: z.number().gte(0).lte(90),
    minutes: z.number().gte(0).lt(60),
    decimalMinutes: z.number().gte(0).lt(9999),
  }),
  longitude: z.object({
    direction: z.nativeEnum(Direction),
    degrees: z.number().gte(0).lte(180),
    minutes: z.number().gte(0).lt(60),
    decimalMinutes: z.number().gte(0).lt(9999),
  }),
  elevation: z.number().gte(0).lt(60000),
  elevationUnit: z.nativeEnum(ElevationUnit),
})

const CoordinateDecoration = ({ children }: { children: React.ReactNode }) => (
  <Box as="span" borderBottom="1px" borderColor="inherit" paddingRight="2">
    {children}
  </Box>
)

export const AngularCoordinateFields = ({ type }: { type: "latitude" | "longitude" }) => (
  <Box display="flex">
    <SelectField name={`${type}.direction`} w="16" variant="flushed">
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
      name={`${type}.degrees`}
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
      name={`${type}.minutes`}
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
      name={`${type}.decimalMinutes`}
      placeholder="00"
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

export const CoordinateFields = () => (
  <Stack direction={["column", "row"]} spacing="32">
    <Box>
      <Box w="48">
        <AngularCoordinateFields type="latitude" />
        <AngularCoordinateFields type="longitude" />
      </Box>
    </Box>
    <Box w="48">
      <Box display="flex" justifyContent="space-between">
        <LabeledTextField
          label="Elevation"
          name="elevation"
          type="number"
          variant="flushed"
          max={60000}
        />
        <SelectField name="elevationUnit" variant="flushed">
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
