import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef } from "react"
import { useFieldArray, UseFieldArrayConfig } from "react-final-form-arrays"

export interface WaypointFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  // type?: "text" | "password" | "email" | "number"
  // outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  // labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldArrayConfig<string>
}

export const WaypointField = forwardRef<HTMLInputElement, WaypointFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      fields,
      meta: { touched, error, submitError },
    } = useFieldArray(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    // const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      // <FormControl {...outerProps}>
      //   <FormLabel {...labelProps}>
      //     <Input {...input} disabled={submitting} {...props} ref={ref} />
      //     {label}
      //   </FormLabel>
      //   {touched && normalizedError && (
      //     <div role="alert" style={{ color: "red" }}>
      //       {normalizedError}
      //     </div>
      //   )}
      // </FormControl>
      <></>
    )
  }
)
