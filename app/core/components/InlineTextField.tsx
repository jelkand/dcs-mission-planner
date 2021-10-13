import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { InputGroup, InputRightElement, VisuallyHidden } from "@chakra-ui/react"
import React, { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface InlineTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  decoration?: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
  rightElementChildren?: React.ReactNode
  hideErrors?: boolean
}

export const InlineTextField = forwardRef<HTMLInputElement, InlineTextFieldProps>(
  (
    {
      hideErrors,
      name,
      label,
      outerProps,
      fieldProps,
      decoration,
      rightElementChildren,
      labelProps,
      ...props
    },
    ref
  ) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <FormControl {...outerProps}>
        <FormLabel mb="0" {...labelProps}>
          <VisuallyHidden>{label}</VisuallyHidden>
          <InputGroup>
            <Input {...input} disabled={submitting} {...props} ref={ref} marginRight="0" />
            {rightElementChildren ?? (
              <InputRightElement pointerEvents="none" paddingRight="6">
                {rightElementChildren}
              </InputRightElement>
            )}
          </InputGroup>
        </FormLabel>
        {!hideErrors && touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </FormControl>
    )
  }
)
