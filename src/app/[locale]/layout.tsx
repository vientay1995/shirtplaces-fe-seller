import ProgressBar from "@/components/ProgressBar";
import { RouteChangeProvider } from "@/contexts/RouteChangeContext";
import ThemeLocalization from "@/layouts/theme/ThemeLocalization";
import { NextIntlProvider } from "@/providers/NextIntlProvider";
import { getMessages } from "@/utils/getMessage";
import { createTranslator } from "next-intl";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props) {
  const messages = await getMessages(locale);
  const t = createTranslator({ locale, messages });

  return {
    title: t("LocaleLayout.title"),
  };
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  return (
    <NextIntlProvider locale={locale}>
      <ThemeLocalization>
        <RouteChangeProvider>
          <ProgressBar />
          {children}
        </RouteChangeProvider>
      </ThemeLocalization>
    </NextIntlProvider>
  );
}
