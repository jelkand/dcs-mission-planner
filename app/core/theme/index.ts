import { extendTheme, ThemeOverride } from "@chakra-ui/react"

import { createBreakpoints } from "@chakra-ui/theme-tools"
// 2. Update the breakpoints as key-value pairs
const breakpoints = createBreakpoints({
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
})

const extendThemeObj: ThemeOverride = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  breakpoints,
}

export type ExtendedTheme = typeof extendThemeObj
export default extendTheme(extendThemeObj)
