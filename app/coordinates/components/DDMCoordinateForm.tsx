import { ElevationUnit, Coordinate } from "db"
import React, { PropsWithoutRef } from "react"
import { z } from "zod"
import { CoordinateFields } from "./CoordinateFields"
import Form, { FormProps } from "app/core/components/Form"

const Coordinate = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  elevation: z.number().int(),
  elevationUnit: z.nativeEnum(ElevationUnit),
})

export const DDMCoordinateForm = <S extends z.ZodType<any, any>>(props: FormProps<S>) => (
  <Form<S> {...props}>
    <CoordinateFields />
  </Form>
)
