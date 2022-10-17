import { MessageType, RuntimeMessageBus } from '@/common/RuntimeMessageBus';
import IdealistaApi from '@/common/IdealistaApi';
import { Storage } from '@/common/Storage';
import PagePreloader from '@/background/PagePreloader';

const messageBus = new RuntimeMessageBus();
const idealistaApi = new IdealistaApi();
const storage = new Storage();
const pagePreloader = new PagePreloader(idealistaApi, storage);

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    chrome.storage.local.clear();
  }
});

messageBus.subscribe(MessageType.PagePreload, async (pageUrl) => {
  await pagePreloader.preloadPage(pageUrl);
});
