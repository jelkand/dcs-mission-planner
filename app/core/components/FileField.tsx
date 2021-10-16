import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Button } from "@chakra-ui/react"
import React, { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef, useRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<FileList>
  accept: string
}

export const FileField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, fieldProps, accept, labelProps, ...props }, ref) => {
    const {
      input: { onChange, value, ...input },
      meta: { touched, error, submitError, submitting },
    } = useField<FileList>(name, fieldProps)

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    const uploadButtonRef = useRef<HTMLInputElement>(null)

    return (
      <FormControl {...outerProps}>
        <FormLabel {...labelProps}>
          {label}
          <Input
            as="button"
            size="sm"
            variant="outline"
            onClick={() => uploadButtonRef?.current?.click()}
          >
            Button
          </Input>
          <input
            hidden
            type="file"
            ref={uploadButtonRef}
            accept={accept}
            {...input}
            onChange={({ target }) => onChange(target.files)}
            {...props}
          />
        </FormLabel>
        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </FormControl>
    )
  }
)
