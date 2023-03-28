import type { WindowMessageBus } from '@/common/WindowMessageBus';
import App from '@/web/App.vue';
import { createApp } from 'vue';
import { createI18n } from "vue-i18n";
import messages from '@/web/i18n/messages';
import { ListingKey, MessageBusKey, IdealistaFiltersObserverKey, IdealistaConfigKey } from '@/web/dependencyInjection';
import type { Listing } from '@/web/listing/Listing';
import type IdealistaFiltersObserver from '@/web/filters/IdealistaFiltersObserver';

export const canMount = (config: IdealistaConfig) => {
  return !config.mapMode;
};

export const mountApp = (
  messageBus: WindowMessageBus,
  config: IdealistaConfig,
  listing: Listing,
  idealistaFiltersObserver: IdealistaFiltersObserver,
) => {
  const appPlaceholder = document.createElement('div');

  const idealistaFilters = document.getElementById('aside-filters');
  const idealistaFilterForm = document.getElementById('filter-form');

  if (idealistaFilters && idealistaFilterForm) {
    idealistaFilters.insertBefore(appPlaceholder, idealistaFilterForm);

    const app = createApp(App);

    app.use(createI18n({
      messages,
      locale: config.locale,
      fallbackLocale: 'en',
      globalInjection: true,
    }));

    app.provide(MessageBusKey, messageBus);
    app.provide(IdealistaFiltersObserverKey, idealistaFiltersObserver);
    app.provide(ListingKey, listing);
    app.provide(IdealistaConfigKey, config);

    app.mount(appPlaceholder);
  }
};
