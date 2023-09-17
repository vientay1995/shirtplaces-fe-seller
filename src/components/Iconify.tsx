// icons
import { Icon, IconifyIcon } from "@iconify/react";
// @mui
import { Box, BoxProps } from "@mui/material";

// ----------------------------------------------------------------------

export const Iconify: React.FC<{ icon: string | IconifyIcon } & Omit<BoxProps, "children" | "ref">> = ({
  icon,
  sx,
  ...other
}) => {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
};
