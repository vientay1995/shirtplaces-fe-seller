export type ColorPresetsKeys = "purple" | "cyan" | "blue" | "orange" | "red" | "default";

export type LayoutKeys = "horizontal" | "vertical";

export interface IThemeSetting {
  themeMode: PaletteMode;
  themeDirection: Direction;
  themeColorPresets: ColorPresetsKeys;
  themeLayout: LayoutKeys;
  themeStretch: boolean;
}
