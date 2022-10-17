import type IdealistaApi from '@/common/IdealistaApi';
import type { Storage } from '@/common/Storage';
import { Scheme } from '@/common/Storage';
import { parse } from 'node-html-parser';
import { asyncFilter, asyncForEach } from '@/utils/array';
import Logger from '@/common/Logger';

export default class PagePreloader {
  private readonly idealistaApi: IdealistaApi;
  private readonly storage: Storage;
  private readonly logger: Logger;

  constructor(idealistaApi: IdealistaApi, storage: Storage) {
    this.idealistaApi = idealistaApi;
    this.storage = storage;
    this.logger = new Logger('BackgroundScript');
  }

  async preloadPage(pageUrl: string) {
    this.logger.log(`Fetching ${pageUrl}`);

    const response = await this.idealistaApi.fetch(pageUrl);
    const body = await response.text();

    const dom = parse(body);

    this.logger.log('Received body');

    const itemIds = dom.querySelectorAll('.items-container .item')
      .map((item) => item.getAttribute('data-adid')!)
      .filter((id) => id);

    this.logger.log(`Found ${itemIds.length} items on page`);

    if (itemIds.length === 0) {
      return;
    }

    await this.preloadAds(itemIds);

    await this.preloadDetails(itemIds);
  }

  private async preloadDetails(itemIds: string[]) {
    const detailsToPreload = await asyncFilter(itemIds, async (id) => {
      const detailsExists = await this.storage.findById(Scheme.Details, id);

      return !detailsExists;
    });

    this.logger.log(`Found ${detailsToPreload.length} details to preload`);

    await asyncForEach(detailsToPreload, async (id) => {
      const details = await this.idealistaApi.fetchDetails(id);

      await this.storage.save(Scheme.Details, id, details);
    });

    this.logger.log(`${detailsToPreload.length} details preloaded`);
  }

  private async preloadAds(itemIds: string[]) {
    const adsToPreload = await asyncFilter(itemIds, async (id) => {
      const adExists = await this.storage.findById(Scheme.Ads, id);
      return !adExists;
    });

    this.logger.log(`Found ${adsToPreload.length} ads to preload.`);

    await asyncForEach(adsToPreload, async (id) => {
      const ad = await this.idealistaApi.fetchAd(id);

      await this.storage.save(Scheme.Ads, id, ad);
    });

    this.logger.log(`${adsToPreload.length} ads preloaded`);
  }
}