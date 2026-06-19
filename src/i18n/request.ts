import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

const supportedLocales = ['es', 'en'] as const;
type Locale = (typeof supportedLocales)[number];
const defaultLocale: Locale = 'es';

function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage.split(',')[0].trim().slice(0, 2) as Locale;
  return supportedLocales.includes(preferred) ? preferred : defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value as Locale | undefined;

  let locale: Locale;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const headersList = await headers();
    locale = detectLocale(headersList.get('accept-language'));
  }

  return { locale, messages: (await import(`../../src/messages/${locale}.json`)).default };
});
