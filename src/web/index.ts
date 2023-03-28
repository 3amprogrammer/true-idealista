import { canMount, mountApp } from '@/web/vueApp';
import { hasProperties } from "@/utils/object";
import { WindowMessageBus, MessageType, RoutingKey } from '@/common/WindowMessageBus';
import { Listing } from '@/web/listing/Listing';
import IdealistaApi from '@/common/IdealistaApi';
import CacheableIdealistaApi from '@/common/CacheableIdealistaApi';
import IdealistaFiltersObserver from '@/web/filters/IdealistaFiltersObserver';
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";
import { config, Locale, locales } from '@/common/Config';

Sentry.init({
  dsn: "https://15922c1d3ff5440c9104c6a2d36cd540@o73711.ingest.sentry.io/6746572",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0,
  sampleRate: 1,
});

const messageBus = new WindowMessageBus(RoutingKey.WebScript);

const canRunExtension = () => {
  const requiredConfigProps = [
    'operationName',
    'mapMode',
    'listingSearchUrl',
    'locationUri',
    'searchWithoutFilters',
  ];

  const requiredListingProps = [
    'show',
    'hide',
  ];

  return window.config
    && hasProperties(window.config, requiredConfigProps)
    && window.listing
    && window.listing.loading
    && hasProperties(window.listing.loading, requiredListingProps)
    && canMount(window.config);
};

if (!canRunExtension()) {
  throw new Error('Unable to run the extension due to missing properties');
}

const findLocale = () => {
  const locale = locales.find((locale: Locale) => {
    const localeConfig = config[locale];

    return localeConfig.domain === window.location.origin;
  });

  if (!locale) {
    throw new Error('Unable to determine the locale');
  }

  return locale;
};

const resolveConfig = () => config[findLocale()];

const basicFiltersObserver = new IdealistaFiltersObserver(window.config);
const idealistaApi = new CacheableIdealistaApi(new IdealistaApi(resolveConfig()), messageBus);
const listing = new Listing(window.listing, idealistaApi);

mountApp(messageBus, window.config, listing, basicFiltersObserver);

messageBus.dispatch({
  type: MessageType.AppMounted,
  routingKey: RoutingKey.ContentScript,
});
