<template>
  <div class="filter-form">
    <DescriptionFilter
        v-model:phrases="filters.search.phrases"
        v-model:type="filters.search.type"
    />

    <RentalPeriodFilter v-model="filters.rentalPeriod"/>

    <AdTypeFilter v-model="filters.adType"/>

    <EnergyConsumption v-model="filters.energyConsumption"/>
  </div>
</template>

<script setup>
import { inject, reactive, toRaw, watch } from 'vue';
import DescriptionFilter from './filters/DescriptionFilter.vue';
import RentalPeriodFilter from './filters/RentalPeriodFilter.vue';
import AdTypeFilter from './filters/AdTypeFilter.vue';
import EnergyConsumption from './filters/EnergyConsumption.vue';
import { MessageType, RoutingKey } from '@/common/WindowMessageBus';
import { IdealistaFiltersObserverKey, ListingKey, MessageBusKey } from '@/web/dependencyInjection';
import { AdType, RentalPeriod, SearchType } from '@/web/listing/Listing';
import { isEqual } from '@/utils/object';

const messageBus = inject(MessageBusKey);
const listing = inject(ListingKey);
const idealistaFiltersObserver = inject(IdealistaFiltersObserverKey);

const defaultFilters = {
  search: {
    phrases: [],
    type: SearchType.Highlight,
  },
  rentalPeriod: RentalPeriod.All,
  adType: AdType.All,
  energyConsumption: []
};

const filters = reactive(Object.assign({}, defaultFilters));

watch(filters, (newFilters) => {
  messageBus.dispatch({
    type: MessageType.FiltersChanged,
    routingKey: RoutingKey.ContentScript,
    payload: toRaw(newFilters),
  });

  listing.applyFilters(newFilters);
});

messageBus.once(MessageType.FiltersChanged, (newFilters) => {
  if (newFilters && !isEqual(toRaw(filters), newFilters)) {
    Object.assign(filters, newFilters);
  }
});

idealistaFiltersObserver.subscribe(() => {
  // TODO: Maybe this should be inside listing class itself
  listing.loadListing();
  listing.applyFilters(filters);
});

const resetFiltersElement = document.querySelector('#reset-filters');

if (resetFiltersElement) {
  resetFiltersElement.style = '';
  resetFiltersElement.addEventListener('click', () => {
    Object.assign(filters, defaultFilters);
  });
}
</script>

<style scoped>
.filter-form {
  margin-bottom: 1.5rem;
}

.item-form:last-child {
  margin-bottom: 1.5rem;
}
</style>