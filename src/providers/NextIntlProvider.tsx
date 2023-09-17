import { getMessages } from "@/utils/getMessage";
import { NextIntlClientProvider } from "next-intl";
import React from "react";

export const NextIntlProvider: React.FC<{ children: React.ReactNode; locale: string }> = async ({
  locale,
  children,
}) => {
  const messages = await getMessages(locale);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};
