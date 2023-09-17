import React from "react";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { getColorPresets, colorPresets } from "@/utils/getColorPresets";
import { defaultSettings as initSetting, COOKIE_KEYS, cookiesExpires } from "@/config";
import { IThemeSetting, ColorPresetsKeys, LayoutKeys } from "@/types/themeSetting";
import { Direction, PaletteMode } from "@mui/material";

const initialState = {
  ...initSetting,
  onChangeMode: () => {},
  onToggleMode: () => {},
  onChangeDirection: () => {},
  onChangeColor: () => {},
  onToggleStretch: () => {},
  onChangeLayout: () => {},
  onResetSetting: () => {},
  setColor: getColorPresets("default"),
  colorOption: [],
};

const SettingsContext = createContext<ISettingsContext>(initialState);

const SettingsProvider: React.FC<SettingsProviderProps> = ({ children, defaultSettings = initSetting }) => {
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  const onChangeMode = (value: PaletteMode) => setSettings({ ...settings, themeMode: value });

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === "light" ? "dark" : "light",
    });
  };

  const onChangeDirection = (value: Direction) => setSettings({ ...settings, themeDirection: value });
  const onChangeColor = (value: ColorPresetsKeys) => setSettings({ ...settings, themeColorPresets: value });
  const onChangeLayout = (value: LayoutKeys) => setSettings({ ...settings, themeLayout: value });

  const onToggleStretch = () => {
    setSettings({
      ...settings,
      themeStretch: !settings.themeStretch,
    });
  };

  const onResetSetting = () => {
    setSettings({
      themeMode: initialState.themeMode,
      themeLayout: initialState.themeLayout,
      themeStretch: initialState.themeStretch,
      themeDirection: initialState.themeDirection,
      themeColorPresets: initialState.themeColorPresets,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onChangeMode,
        onToggleMode,
        onChangeDirection,
        onChangeColor,
        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),
        onToggleStretch,
        onChangeLayout,
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };

function useSettingCookies(
  defaultSettings: IThemeSetting
): [IThemeSetting, React.Dispatch<React.SetStateAction<IThemeSetting>>] {
  const [settings, setSettings] = useState(defaultSettings);

  const onChangeSetting = () => {
    Cookies.set(COOKIE_KEYS.THEME_MODE, settings.themeMode, { expires: cookiesExpires });

    Cookies.set(COOKIE_KEYS.THEME_DIRECTION, settings.themeDirection, { expires: cookiesExpires });

    Cookies.set(COOKIE_KEYS.THEME_COLOR_PRESETS, settings.themeColorPresets, {
      expires: cookiesExpires,
    });

    Cookies.set(COOKIE_KEYS.THEME_LAYOUT, settings.themeLayout, {
      expires: cookiesExpires,
    });

    Cookies.set(COOKIE_KEYS.THEME_STRETCH, JSON.stringify(settings.themeStretch), {
      expires: cookiesExpires,
    });
  };

  useEffect(() => {
    onChangeSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return [settings, setSettings];
}

export interface ISettingsContext extends IThemeSetting {
  onChangeMode: (value: PaletteMode) => void;
  onChangeDirection: (value: Direction) => void;
  onChangeColor: (value: ColorPresetsKeys) => void;
  onChangeLayout: (value: LayoutKeys) => void;
  onToggleMode: () => void;
  onToggleStretch: () => void;
  onResetSetting: () => void;
  setColor: ReturnType<typeof getColorPresets>;
  colorOption: { name: string; value: string }[];
}

export interface SettingsProviderProps {
  defaultSettings: IThemeSetting;
  children: React.ReactNode;
}
