import { hasProperties } from '@/utils/object';
import Logger from '@/common/Logger';

export enum MessageType {
  AppMounted = 'app.mounted',
  FiltersChanged = 'filters.changed',
  CacheLoaded = 'cache.loaded',
  AdLoaded = 'ad.loaded',
  DetailsLoaded = 'details.loaded',
}

export enum RoutingKey {
  WebScript = 'web',
  ContentScript = 'content',
  All = '*'
}

type Handler = (payload?: any) => void;

type Message = {
  payload?: any,
  type: MessageType
  routingKey: RoutingKey,
}

export class WindowMessageBus {
  private readonly handlers: Map<MessageType, Handler[]>;
  private readonly oneTimeHandlers: Map<MessageType, Handler[]>;
  private readonly bindingKey: RoutingKey;
  private readonly logger: Logger;

  constructor(bindingKey: RoutingKey) {
    this.handlers = new Map();
    this.oneTimeHandlers = new Map();
    this.bindingKey = bindingKey;
    this.logger = new Logger('WindowMessageBus');

    window.addEventListener('message', this.handleEvent.bind(this));
  }

  subscribe(messageType: MessageType, handler: Handler) {
    this.logger.log(`Subscribing on ${messageType}`);

    this.handlers.set(messageType, [
      ...(this.handlers.get(messageType) || []),
      handler,
    ]);
  }

  once(messageType: MessageType, handler: Handler) {
    this.logger.log(`Subscribing once on ${messageType}`);

    this.oneTimeHandlers.set(messageType, [
      ...(this.oneTimeHandlers.get(messageType) || []),
      handler,
    ]);
  }

  dispatch(message: Message) {
    this.logger.log(`Dispatching ${message.type}`, message);

    window.postMessage(message);
  }

  private handleEvent(event: MessageEvent) {
    const message = this.extractMessage(event);

    if (!message) {
      return;
    }

    const logger = this.logger.group(message.type);
    logger.log(`Received ${message.type}`, message);

    if (!this.shouldHandle(message.routingKey)) {
      logger.log('Skipping due to inapplicable routing key');
      logger.end();

      return;
    }

    const handlers = [
      ...(this.handlers.get(message.type) || []),
      ...(this.oneTimeHandlers.get(message.type) || []),
    ];

    logger.log(`Handling ${message.type}. Found ${(handlers || []).length} handlers`);

    if (!handlers) {
      return;
    }

    try {
      handlers.forEach(handler => handler(event.data.payload));
    } catch (e) {
      logger.log(`Error while handling ${message.type}`, e);
    }

    logger.log(`Finished handling ${message.type}`);
    logger.end();

    this.oneTimeHandlers.delete(message.type);
  }

  private extractMessage(event: MessageEvent) {
    if (!hasProperties(event.data, ['type', 'routingKey'])) {
      return;
    }

    return event.data as Message;
  }

  private shouldHandle(routingKey: RoutingKey) {
    return routingKey === this.bindingKey || routingKey === RoutingKey.All;
  }
}