import type { InjectionKey } from 'vue';
import type { WindowMessageBus } from '@/common/WindowMessageBus';
import type { Listing } from '@/web/listing/Listing';
import type IdealistaFiltersObserver from '@/web/filters/IdealistaFiltersObserver';

export const IdealistaConfigKey: InjectionKey<IdealistaConfig> = Symbol('IdealistaConfig');
export const MessageBusKey: InjectionKey<WindowMessageBus> = Symbol('MessageBus');
export const ListingKey: InjectionKey<Listing> = Symbol('Listing');
export const IdealistaFiltersObserverKey: InjectionKey<IdealistaFiltersObserver> = Symbol('IdealistaFiltersObserver');
