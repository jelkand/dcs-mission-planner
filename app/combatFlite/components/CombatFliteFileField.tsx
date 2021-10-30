import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { AttachmentIcon } from "@chakra-ui/icons"
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/input"
import { Box } from "@chakra-ui/react"
import { WaypointTable } from "app/waypoint-sets/components/WaypointTable"
import { Coordinate, Waypoint, WaypointSetWaypoint } from "db"
import parser from "fast-xml-parser"
import React, { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef, useRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

import { combatFliteToWaypoints } from "../transformers"
import { CombatFliteSchema } from "../validations"

type InputOmitFieldNames = "id" | "createdAt" | "updatedAt"

export interface LabeledTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  placeholder?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<CombatFliteInput>
  accept: string
}

// centralize
export interface CombatFliteWaypointSet {
  waypoints: (Omit<
    WaypointSetWaypoint,
    InputOmitFieldNames | "waypointSetId" | "waypointId" | "sequenceNum"
  > & {
    waypoint: Omit<Waypoint, InputOmitFieldNames | "coordinateId" | "waypointType"> & {
      coordinate: Omit<Coordinate, InputOmitFieldNames>
    }
  })[]
}

interface CombatFliteInput {
  fileName: string
  waypointSet: CombatFliteWaypointSet
}

const sanitizeFields = (object: Record<string, any>) => {
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === "string") {
      object[key] = value.replace("\n", " ")
    } else if (typeof value === "object") {
      object.key = sanitizeFields(value)
    }
  })
  return object
}

export const fileChangeHandler = async ({
  target,
}: React.ChangeEvent<HTMLInputElement>): Promise<CombatFliteInput> => {
  const { files } = target
  const text = await files?.[0]?.text()
  const json = parser.parse(text ?? "", {}, true)
  const sanitized = sanitizeFields(json)
  const parsed = CombatFliteSchema.parse(sanitized)
  return { fileName: files?.item(0)?.name ?? "N/A", waypointSet: combatFliteToWaypoints(parsed) }
}

export const CombatFliteFileField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, fieldProps, accept, labelProps, placeholder, ...props }, ref) => {
    const {
      input: { onChange, value, ...input },
      meta: { touched, error, submitError, submitting },
    } = useField<CombatFliteInput>(name, fieldProps)

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    const uploadButtonRef = useRef<HTMLInputElement>(null)

    console.log({ touched, error })

    return (
      <FormControl {...outerProps}>
        <FormLabel {...labelProps}>
          <InputGroup>
            <InputLeftAddon>
              <AttachmentIcon />
            </InputLeftAddon>
            <Input
              {...input}
              value={value?.fileName || placeholder}
              onClick={() => uploadButtonRef?.current?.click()}
              readOnly
            ></Input>
            <input
              hidden
              type="file"
              ref={uploadButtonRef}
              accept={accept}
              {...input}
              onChange={async (event) => onChange(await fileChangeHandler(event))}
              {...props}
            />
          </InputGroup>
          {label}
        </FormLabel>
        {/* {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )} */}
        {value && (
          <Box>
            <WaypointTable waypoints={value.waypointSet.waypoints} />
          </Box>
        )}
      </FormControl>
    )
  }
)
