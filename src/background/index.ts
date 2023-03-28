import { MessageType, RuntimeMessageBus } from '@/common/RuntimeMessageBus';
import IdealistaApi from '@/common/IdealistaApi';
import { Storage } from '@/common/Storage';
import PagePreloader from '@/background/PagePreloader';
import { Locale, config, locales } from '@/common/Config';

const messageBus = new RuntimeMessageBus();
const storage = new Storage();

type PagePreloaderCollection = { [key in Locale]?: PagePreloader };

const pagePreloaderCollection: PagePreloaderCollection = {};

locales.forEach((locale) => {
  const idealistaApi = new IdealistaApi(config[locale]);

  pagePreloaderCollection[locale] = new PagePreloader(idealistaApi, storage);
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    chrome.storage.local.clear();
  }
});

messageBus.subscribe(MessageType.PagePreload, async (pageUrl) => {
  const url = new URL(pageUrl);
  const locale = locales.find((locale: Locale) => {
    const localeConfig = config[locale];

    return localeConfig.domain === url.origin;
  });

  if (!locale) {
    throw new Error('Unable to determine the locale to preload page');
  }

  const pagePreloader = pagePreloaderCollection[locale];
  if (pagePreloader) {
    await pagePreloader.preloadPage(pageUrl);
  }
});
