import Logger from '@/common/Logger';

export enum MessageType {
  PagePreload = 'page.preload',
}

type Handler = (payload?: any) => void;

type Message = {
  payload?: any,
  type: MessageType
}

export class RuntimeMessageBus {
  private readonly handlers: Map<MessageType, Handler[]>;
  private readonly logger: Logger;

  constructor() {
    this.handlers = new Map();
    this.logger = new Logger('RuntimeMessageBus');

    chrome.runtime.onMessage.addListener(async (message: Message, sender) => {
      const logger = this.logger.group(message.type);
      logger.log(`Received ${message.type}`, message);

      const handlers = this.handlers.get(message.type);

      logger.log(`Handling ${message.type}. Found ${(handlers || []).length} handlers`);

      if (!handlers) {
        return;
      }

      try {
        handlers.forEach(handler => handler(message.payload));
      } catch (e) {
        logger.log(`Error while handling ${message.type}`, e);
      }

      logger.log(`Finished handling ${message.type}`);
      logger.end();
    });
  }

  subscribe(messageType: MessageType, handler: Handler) {
    this.logger.log(`Subscribing on ${messageType}`);

    this.handlers.set(messageType, [
      ...(this.handlers.get(messageType) || []),
      handler,
    ]);
  }

  dispatch(message: Message) {
    this.logger.log(`Dispatching ${message.type}`, message);

    chrome.runtime.sendMessage(message);
  }
}
