import { ColorPresetsKeys } from "@/types/themeSetting";
import { palette } from "@/layouts/theme/configs";
import colors from "@/resources/colors.json";

export const colorPresets = [{ name: "default", ...palette.light.primary }, ...colors];

export const getColorPresets = (presetsKey: ColorPresetsKeys) => {
  return colorPresets.reduce(
    (colorObj, item) => ({ ...colorObj, [item.name]: item }),
    {} as Record<ColorPresetsKeys, (typeof colorPresets)[number]>
  )[presetsKey];
};
