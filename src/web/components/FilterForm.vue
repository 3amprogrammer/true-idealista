<template>
  <div class="filter-form">
    <div class="review">
      <p>If you like or dislike the extension, please leave a review, that really helps me, thank you!</p>
      <a target="_blank"
         href="https://chrome.google.com/webstore/detail/true-idealista/egglpbadghnchmhpljcpjjapeomodcim"
         class="review-btn">
        ♥ <span class="text">Leave a review</span> ♥
      </a>
    </div>

    <DescriptionFilter
        v-model:phrases="filters.search.phrases"
        v-model:type="filters.search.type"
    />

    <RentalPeriodFilter v-if="config.operationName === 'rent'" v-model="filters.rentalPeriod"/>

    <AdTypeFilter v-if="config.operationName === 'rent'" v-model="filters.adType"/>

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
import { IdealistaConfigKey, IdealistaFiltersObserverKey, ListingKey, MessageBusKey } from '@/web/dependencyInjection';
import { AdType, RentalPeriod, SearchType } from '@/web/listing/Listing';
import { isEqual } from '@/utils/object';

const config = inject(IdealistaConfigKey);
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
  energyConsumption: [],
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
.text {
  margin: 0 5px;
}

.review {
  margin-bottom: 10px;
}

.review-btn {
  padding: 10px 15px;
  border-radius: 0.125rem;
  background-color: #B62682;
  border: 0.0625rem solid #B62682;
  box-shadow: inset 0 -0.0625rem 0.0625rem 0 #8c1d64, inset 0 1px 1px 0 rgba(255, 255, 255, 0.5);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  display: block;
  text-align: center;
}

.filter-form {
  margin-bottom: 1.5rem;
}

.item-form:last-child {
  margin-bottom: 1.5rem;
}
</style>
