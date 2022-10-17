import { MessageType as WindowMessageType, RoutingKey, WindowMessageBus } from '@/common/WindowMessageBus';
import Extension from '@/content/Extension';
import { Storage } from '@/common/Storage';
import { RuntimeMessageBus } from '@/common/RuntimeMessageBus';

const injectStyle = (src: string) => {
  const link = document.createElement('link');

  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', src);

  document.head.appendChild(link);
};

const injectScript = (src: string) => {
  const script = document.createElement('script');

  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);

  document.body.appendChild(script);
};

const windowMessageBus = new WindowMessageBus(RoutingKey.ContentScript);
const runtimeMessageBus = new RuntimeMessageBus();
const storage = new Storage();

injectStyle(chrome.runtime.getURL('true-idealista-style.css'));
injectScript(chrome.runtime.getURL('true-idealista-web.js'));

windowMessageBus.subscribe(WindowMessageType.AppMounted, () => {
  const extension = new Extension(windowMessageBus, runtimeMessageBus, storage);

  extension.run();
});
