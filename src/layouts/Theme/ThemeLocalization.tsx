"use client";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { useLocale } from "next-intl";
import { enUS, viVN } from "@mui/material/locale";

const systemValue = {
  vi: viVN,
  en: enUS,
};

export default function ThemeLocalization({ children }: { children: React.ReactNode }) {
  const defaultTheme = useTheme();
  const locale = useLocale();

  const theme = createTheme(defaultTheme as any, systemValue[locale as keyof typeof systemValue]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
