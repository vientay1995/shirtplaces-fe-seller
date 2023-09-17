import { defaultSettings, COOKIE_KEYS } from "@/config";

const getData = (value: any) => {
  if (value === "true" || value === "false") return JSON.parse(value);
  if (value === "undefined" || !value) return "";
  return value;
};

export const getSettings = (cookies: { name: string; value: string }[]) => {
  return cookies.reduce((setting, cookie) => {
    if (!Object.values(COOKIE_KEYS).includes(cookie.name as COOKIE_KEYS)) return setting;

    return {
      ...setting,
      [cookie.name]: getData(cookie.value),
    };
  }, defaultSettings);
};
