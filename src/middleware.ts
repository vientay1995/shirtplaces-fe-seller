import { defaultLocale, languages } from "./locales/setting";
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: languages,
  defaultLocale,
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
