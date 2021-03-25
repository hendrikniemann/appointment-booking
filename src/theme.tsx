import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

const theme = extendTheme({
  shadows: {
    ...defaultTheme.shadows,
    md: "0 0 6px -1px rgba(0, 0, 0, 0.1), 0 0 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 0 15px -3px rgba(0, 0, 0, 0.1), 0 0 6px -2px rgba(0, 0, 0, 0.05)",
  },
});

export default theme;
