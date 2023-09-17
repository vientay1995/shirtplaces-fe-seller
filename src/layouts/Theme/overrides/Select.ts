import { Theme } from "@mui/material";
import { InputSelectIcon } from "./CustomIcons";

// ----------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: InputSelectIcon,
      },
    },
  };
}
