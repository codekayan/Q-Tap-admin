import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend';
import LngDetector from 'i18next-browser-languagedetector';
i18n.use(initReactI18next)
    .use(LngDetector)
    .use(HttpApi)
    .init({
        // resources:{},
        // lng: "ar",
        fallbackLng: "en",
        backend: {
            loadPath: "/locales/{{lng}}/translation.json"
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage',],

            // keys or params to lookup language from
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,

            // cache user language on
            caches: ['localStorage', 'cookie'],
            excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
        }
    })

export default i18n;