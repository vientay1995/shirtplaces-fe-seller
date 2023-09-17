import { IThemeSetting } from "./types/themeSetting";

export const defaultSettings: IThemeSetting = {
  themeMode: "light",
  themeDirection: "ltr",
  themeColorPresets: "default",
  themeLayout: "horizontal",
  themeStretch: false,
};

export const cookiesExpires = 3;

export enum COOKIE_KEYS {
  THEME_MODE = "themeMode",
  THEME_DIRECTION = "themeDirection",
  THEME_COLOR_PRESETS = "themeColorPresets",
  THEME_LAYOUT = "themeLayout",
  THEME_STRETCH = "themeStretch",
  LANGE = "NEXT_LOCALE",
}
