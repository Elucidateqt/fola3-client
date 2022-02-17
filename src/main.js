import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import { createI18n } from 'vue-i18n'
import translations from './lang'

const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    en: translations.en.dict,
    de: translations.de.dict
  },
  datetimeFormats: {
    en: translations.en.dateTimeFormat,
    de: translations.de.dateTimeFormat
  }
})

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .use(i18n)
  .mount("#app");
