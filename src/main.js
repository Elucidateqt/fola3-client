import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import { createI18n } from 'vue-i18n'
import translations from './lang'
import VueMatomo from 'vue-matomo'
import FolaCard from './components/FolaCard'

//include language files and create internationalization plugin
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'de',
  messages: {
    en: translations.en.dict,
    de: translations.de.dict
  },
  datetimeFormats: {
    en: translations.en.dateTimeFormat,
    de: translations.de.dateTimeFormat
  }
})

const app = createApp(App)
app.component("FolaCard", FolaCard)

app.use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueMatomo, {
    // Configure your matomo server and site by providing
    host: 'https://analytics.elvir.dev',
    siteId: 2,
  
    // Changes the default .js and .php endpoint's filename
    // Default: 'matomo'
    trackerFileName: 'matomo',
  
    // Overrides the autogenerated tracker endpoint entirely
    // Default: undefined
    // trackerUrl: 'https://example.com/whatever/endpoint/you/have',
  
    // Overrides the autogenerated tracker script path entirely
    // Default: undefined
    // trackerScriptUrl: 'https://example.com/whatever/script/path/you/have',
  
    // Enables automatically registering pageviews on the router
    router: router,
  
    // Enables link tracking on regular links. Note that this won't
    // work for routing links (ie. internal Vue router links)
    // Default: true
    enableLinkTracking: true,
  
    // Require consent before sending tracking information to matomo
    // Default: false
    requireConsent: true,
  
    // Whether to track the initial page view
    // Default: true
    trackInitialView: true,
  
    // Run Matomo without cookies
    // Default: false
    disableCookies: false,
  
    // Require consent before creating matomo session cookie
    // Default: false
    requireCookieConsent: true,
  
    // Enable the heartbeat timer (https://developer.matomo.org/guides/tracking-javascript-guide#accurately-measure-the-time-spent-on-each-page)
    // Default: false
    enableHeartBeatTimer: false,
  
    // Set the heartbeat timer interval
    // Default: 15
    heartBeatTimerInterval: 15,
  
    // Whether or not to log debug information
    // Default: false
    debug: false,
  
    // UserID passed to Matomo (see https://developer.matomo.org/guides/tracking-javascript-guide#user-id)
    // Default: undefined
    userId: undefined,
  
    // Share the tracking cookie across subdomains (see https://developer.matomo.org/guides/tracking-javascript-guide#measuring-domains-andor-sub-domains)
    // Default: undefined, example '*.example.com'
    cookieDomain: undefined,
  
    // Tell Matomo the website domain so that clicks on these domains are not tracked as 'Outlinks'
    // Default: undefined, example: '*.example.com'
    domains: 'https://fola3.elvir.dev',
  
    // A list of pre-initialization actions that run before matomo is loaded
    // Default: []
    // Example: [
    //   ['API_method_name', parameter_list],
    //   ['setCustomVariable','1','VisitorType','Member'],
    //   ['appendToTrackingUrl', 'new_visit=1'],
    //   etc.
    // ]
    preInitActions: [],
  
    // A function to determine whether to track an interaction as a site search
    // instead of as a page view. If not a function, all interactions will be
    // tracked as page views. Receives the new route as an argument, and
    // returns either an object of keyword, category (optional) and resultsCount
    // (optional) to track as a site search, or a falsey value to track as a page
    // view.
    // Default: false, i.e. track all interactions as page views
    // Example: (to) => {
    //   if (to.query.q && to.name === 'search') {
    //     return { keyword: to.query.q, category: to.params.category }
    //   } else {
    //    return null
    //   }
    // }
    trackSiteSearch: false
  })
  .mount("#app");
