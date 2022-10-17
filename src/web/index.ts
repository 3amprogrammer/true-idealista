import { canMount, mountApp } from '@/web/vueApp';
import { hasProperties } from "@/utils/object";
import { WindowMessageBus, MessageType, RoutingKey } from '@/common/WindowMessageBus';
import { Listing } from '@/web/listing/Listing';
import IdealistaApi from '@/common/IdealistaApi';
import CacheableIdealistaApi from '@/common/CacheableIdealistaApi';
import IdealistaFiltersObserver from '@/web/filters/IdealistaFiltersObserver';
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://15922c1d3ff5440c9104c6a2d36cd540@o73711.ingest.sentry.io/6746572",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0,
  sampleRate: 1,
});

const requiredProps = [
  'operationName',
  'mapMode',
  'listingSearchUrl',
  'locationUri',
  'searchWithoutFilters',
];

const messageBus = new WindowMessageBus(RoutingKey.WebScript);

if (window.config && hasProperties(window.config, requiredProps) && canMount(window.config)) {
  // TODO: Assert window.listing has keys
  const basicFiltersObserver = new IdealistaFiltersObserver(window.config);
  const idealistaApi = new CacheableIdealistaApi(new IdealistaApi(), messageBus);
  const listing = new Listing(window.listing, idealistaApi);

  mountApp(messageBus, window.config, listing, basicFiltersObserver);

  messageBus.dispatch({
    type: MessageType.AppMounted,
    routingKey: RoutingKey.ContentScript,
  });
}
