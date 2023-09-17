import React, { useMemo } from "react";
import { ThemeProvider as ThemeMuiProvider, alpha, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
import { APP_KEY } from "@/constants";
import { palette, typography, shadows, customShadows, breakpoints } from "@/layouts/theme/configs";
import componentsOverride from "./overrides";
import { useSettings } from "@/hooks/useSettings";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { setColor, themeMode, themeDirection } = useSettings();

  const isLight = themeMode === "light";

  const themeOptions = useMemo(() => {
    return {
      typography,
      breakpoints,
      palette: { ...(isLight ? palette.light : palette.dark), primary: setColor },
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: {
        ...(isLight ? customShadows.light : customShadows.dark),
        primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
      },
      direction: themeDirection,
      shape: { borderRadius: 8 },
    };
  }, [isLight, setColor, themeDirection]);

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: APP_KEY.toLocaleLowerCase() }}>
      <ThemeMuiProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeMuiProvider>
    </NextAppDirEmotionCacheProvider>
  );
};
