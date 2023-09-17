"use client";
import React from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/layouts/theme/ThemeProvider";
import { IThemeSetting } from "@/types/themeSetting";
import { LocalizationProvider } from "./LocalizationProvider";
import { NotistackProvider } from "./NotistackProvider";
import { NextAuthProvider } from "./NextAuthProvider";

export interface ProviderProps {
  settings: IThemeSetting;
  children: React.ReactNode;
  lng?: string;
}

export const Provider: React.FC<ProviderProps> = ({ children, settings }) => {
  return (
    <NextAuthProvider>
      <SettingsProvider defaultSettings={settings}>
        <LocalizationProvider>
          <ThemeProvider>
            <NotistackProvider>{children}</NotistackProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </SettingsProvider>
    </NextAuthProvider>
  );
};
