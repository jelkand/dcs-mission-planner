import React, { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Select, VisuallyHidden } from "@chakra-ui/react"

export interface SelectFieldProps extends ComponentPropsWithoutRef<typeof Select> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string

  options: React.ReactNode

  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
  hideErrors?: boolean
}

export const SelectField = forwardRef<HTMLInputElement, SelectFieldProps>(
  (
    { hideErrors, name, label, outerProps, fieldProps, children, options, labelProps, ...props },
    ref
  ) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <FormControl {...outerProps}>
        <VisuallyHidden>
          <FormLabel>Direction</FormLabel>
        </VisuallyHidden>
        <Select disabled={submitting} {...input} {...props}>
          {children}
        </Select>
        {!hideErrors && touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </FormControl>
    )
  }
)
