import { MessageType, RoutingKey, WindowMessageBus } from '@/common/WindowMessageBus';
import type { IdealistaApiInterface, Details, Ad } from '@/common/IdealistaApiInterface';
import Logger from '@/common/Logger';

type Cache = {
  ads: Map<string, Ad>,
  details: Map<string, Details>
}

export default class CacheableIdealistaApi {
  private readonly idealistaApi: IdealistaApiInterface;
  private readonly messageBus: WindowMessageBus;
  private readonly logger: Logger;
  private readonly cache: Cache;

  constructor(idealistaApi: IdealistaApiInterface, messageBus: WindowMessageBus) {
    this.idealistaApi = idealistaApi;
    this.messageBus = messageBus;
    this.logger = new Logger('CacheableIdealistaApi');
    this.cache = {
      ads: new Map(),
      details: new Map(),
    };

    this.messageBus.once(MessageType.CacheLoaded, ({ ads, details }) => {
      ads && Object.keys(ads).forEach((key) => {
        this.cache.ads.set(key, ads[key]);
      });

      details && Object.keys(details).forEach((key) => {
        this.cache.details.set(key, details[key]);
      });
    });
  }

  async fetchAd(id: string): Promise<Ad> {
    const logger = this.logger.group(`Ad ${id}`)

    if (this.cache.ads.has(id)) {
      logger.log('Cache hit');
      logger.end();

      return this.cache.ads.get(id)!;
    }

    logger.log('Cache miss');

    const ad = await this.idealistaApi.fetchAd(id);

    this.messageBus.dispatch({
      type: MessageType.AdLoaded,
      routingKey: RoutingKey.ContentScript,
      payload: {
        id,
        content: ad
      },
    });

    this.cache.ads.set(id, ad);

    logger.log('Cache updated');
    logger.end();

    return ad;
  }

  async fetchDetails(id: string): Promise<Details> {
    const logger = this.logger.group(`Details ${id}`)

    if (this.cache.details.has(id)) {
      logger.log('Cache hit');
      logger.end();

      return this.cache.details.get(id)!;
    }

    logger.log('Cache miss');

    const data = await this.idealistaApi.fetchDetails(id);

    this.messageBus.dispatch({
      type: MessageType.DetailsLoaded,
      routingKey: RoutingKey.ContentScript,
      payload: {
        id,
        data,
      },
    });

    this.cache.details.set(id, data);

    logger.log('Cache updated');
    logger.end();

    return data;
  }

  async fetch(urlPart: string) {
    return this.idealistaApi.fetch(urlPart);
  }
}
