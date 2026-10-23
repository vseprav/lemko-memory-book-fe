import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export const LANGUAGES = ['ua', 'en'] as const;
export type Language = typeof LANGUAGES[number];
export const DEFAULT_LANGUAGE: Language = 'ua';

// i18next uses 'ua' for the Ukrainian file; the HTML lang attribute needs the ISO code 'uk'
const HTML_LANG: Record<Language, string> = {ua: 'uk', en: 'en'};

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: DEFAULT_LANGUAGE,
        supportedLngs: LANGUAGES as unknown as string[],
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false, // React already does escaping
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        // Ukrainian is the default for everyone, whatever the browser's language. English is used
        // only after the visitor picks it, and the choice is remembered in this browser.
        detection: {
            order: ['localStorage'],
            lookupLocalStorage: 'lang',
            caches: ['localStorage'],
        },
    });

// The HTML lang attribute and the page title follow the language; the title once its file is loaded
const updateDocument = () => {
    const lng = i18n.resolvedLanguage || DEFAULT_LANGUAGE;
    const language = (LANGUAGES as readonly string[]).includes(lng) ? lng as Language : DEFAULT_LANGUAGE;
    document.documentElement.lang = HTML_LANG[language];
    if (i18n.exists('meta.title')) {
        document.title = i18n.t('meta.title');
    }
};
i18n.on('languageChanged', updateDocument);
i18n.on('loaded', updateDocument);

export default i18n;
