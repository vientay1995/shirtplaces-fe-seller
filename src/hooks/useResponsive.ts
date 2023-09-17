import { Breakpoint, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type UseResponsive = (
  query: "up" | "down" | "between" | "only",
  key: Breakpoint,
  start?: number | Breakpoint,
  end?: number | Breakpoint
) => boolean | undefined;

export const useResponsive: UseResponsive = (query, key, start = "xs", end = "xs") => {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key));
  const mediaDown = useMediaQuery(theme.breakpoints.down(key));
  const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end));
  const mediaOnly = useMediaQuery(theme.breakpoints.only(key));

  if (query === "up") return mediaUp;
  if (query === "down") return mediaDown;
  if (query === "between") return mediaBetween;
  if (query === "only") return mediaOnly;
};
