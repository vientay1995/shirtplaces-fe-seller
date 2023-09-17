import { palette, typography, shadows, customShadows, breakpoints } from "@/layouts/theme/configs";
import { Direction, Theme as MuiTheme } from "@mui/material";
import { Typography } from "@mui/material/styles/createTypography";

declare module "@mui/material/styles" {
  interface TypeBackground {
    default: string;
    paper: string;
    neutral: string;
  }

  export interface PaletteColor {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
    darker: string;
    lighter: string;
  }

  interface Theme {
    palette: (typeof palette)["light"];
    typography: Typography;
    shape: { borderRadius: number };
    direction: Direction | string;
    shadows: (typeof shadows)["light"];
    customShadows: (typeof customShadows)["light"];
    components?: MuiTheme["components"];
  }

  interface ThemeOptions {
    palette?: (typeof palette)["light"];
    typography?: typeof typography;
    shape?: { borderRadius: number };
    direction?: Direction;
    shadows?: (typeof shadows)["light"];
    customShadows?: (typeof customShadows)["light"];
    breakpoints?: typeof breakpoints;
    components?: MuiTheme["components"];
  }
}
