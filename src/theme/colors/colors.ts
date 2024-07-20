const gray = {
  900: "#000000", // Main Text (changed to black)
  800: "#1A1A1A", // Paragraph
  700: "#333333",
  600: "#666666", // Low Priority form Title/Text
  500: "#999999",
  400: "#CCCCCC", // Border
  300: "#E6E6E6",
  200: "#F2F2F2", // Line Stroke
  100: "#F9F9F9",
  white: "#FFFFFF",
};

const textColor = {
  hint: gray[600],
  muted: gray[600],
  primary: gray[900],
  disabled: gray[400],
  secondary: gray[800],
};

const bodyColor = {
  default: gray[100],
  paper: gray["white"],
  text: textColor.primary,
};

const primaryColor = {
  light: "#E6F2FF",
  main: "#0071FC", // Primary color
  dark: "#005ACB",
  text: "#FFFFFF",
  100: "#CCE4FF",
  200: "#99C9FF",
  300: "#66ADFF",
  400: "#3392FF",
  500: "#0071FC",
  600: "#005ACB",
  700: "#00439A",
  800: "#002D69",
  900: "#001638",
};

const secondaryColor = {
  light: "rgba(255, 194, 15, 0.2)",
  main: "#FFC20F", // Secondary color
  dark: "#CCAB00",
  text: "#000000",
  900: "#664D00",
  100: "#FFF7D9",
};

const dark = {
  main: "#000000", // Changed to black
};

const warningColor = {
  main: "#FFC20F", // Using secondary color for warning
  text: textColor.primary,
};

const errorColor = {
  main: "#FF3B30",
  light: "#FFD1CF",
  text: textColor.primary,
};

const successColor = {
  text: textColor.primary,
  main: "#34C759",
  light: "#D1F2DA",
};

const defaultColor = {
  main: textColor.primary,
  dark: textColor.primary,
  text: textColor.primary,
  light: textColor.secondary,
};

const paste = {
  50: "#F5F5F5",
  100: "#E6F7FF",
  main: "#00A3FF", // Light color
};

const marron = {
  50: "#f3f5f9",
  100: "#F6F2ED",
  main: "#BE7374", // Kept as is, as it wasn't part of the new scheme
};

export const blue = {
  50: "#E6F2FF",
  100: "#CCE4FF",
  200: "#99C9FF",
  300: "#66ADFF",
  400: "#3392FF",
  500: "#0071FC", // Primary color
  600: "#005ACB",
  700: "#00439A",
  800: "#002D69",
  900: "#001638",
  main: "#0071FC", // Primary color
};

export const colors = {
  dark,
  gray,
  blue,
  paste,
  marron,
  text: textColor,
  body: bodyColor,
  error: errorColor,
  warn: warningColor,
  success: successColor,
  default: defaultColor,
  primary: primaryColor,
  secondary: secondaryColor,
};