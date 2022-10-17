import {
  MessageType as WindowMessageType,
  RoutingKey,
  WindowMessageBus,
} from '@/common/WindowMessageBus';
import { Scheme, Storage } from '@/common/Storage';
import { RuntimeMessageBus, MessageType as RuntimeMessageType } from '@/common/RuntimeMessageBus';

export default class Extension {
  private readonly windowMessageBus: WindowMessageBus;
  private readonly runtimeMessageBus: RuntimeMessageBus;
  private readonly storage: Storage;

  constructor(windowMessageBus: WindowMessageBus, runtimeMessageBus: RuntimeMessageBus, storage: Storage) {
    this.runtimeMessageBus = runtimeMessageBus;
    this.windowMessageBus = windowMessageBus;
    this.storage = storage;
  }

  async run(): Promise<void> {
    this.subscribeToMessages();

    await this.dispatchCacheLoaded();

    await this.dispatchFiltersChanged();

    await this.dispatchPreloadPage();
  }

  private subscribeToMessages() {
    this.windowMessageBus.subscribe(WindowMessageType.FiltersChanged, async (filters: object) => {
      await this.storage.save(Scheme.Filters, 'extension', filters);
    });

    this.windowMessageBus.subscribe(WindowMessageType.AdLoaded, async ({ id, content }) => {
      await this.storage.save(Scheme.Ads, id, content);
    });

    this.windowMessageBus.subscribe(WindowMessageType.DetailsLoaded, async ({ id, data }) => {
      await this.storage.save(Scheme.Details, id, data);
    });
  }

  private async dispatchFiltersChanged() {
    this.windowMessageBus.dispatch({
      type: WindowMessageType.FiltersChanged,
      routingKey: RoutingKey.WebScript,
      payload: await this.storage.findById(Scheme.Filters, 'extension'),
    });
  }

  private async dispatchCacheLoaded() {
    this.windowMessageBus.dispatch({
      type: WindowMessageType.CacheLoaded,
      routingKey: RoutingKey.WebScript,
      payload: {
        ads: await this.storage.findAll(Scheme.Ads),
        details: await this.storage.findAll(Scheme.Details),
      },
    });
  }

  private async dispatchPreloadPage() {
    const pageUrl = this.nextPageUrl();

    if (pageUrl) {
      this.runtimeMessageBus.dispatch({
        type: RuntimeMessageType.PagePreload,
        payload: pageUrl,
      });
    }
  }

  private nextPageUrl() {
    const nextButton = document.querySelector('.pagination .next a');

    if (!nextButton) {
      return;
    }

    return nextButton.getAttribute('href');
  }
}