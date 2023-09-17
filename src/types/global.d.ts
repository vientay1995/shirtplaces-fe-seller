type Messages = typeof import("@/locales/en.json");

declare interface IntlMessages extends Messages {
  [x: string]: anh;
}
