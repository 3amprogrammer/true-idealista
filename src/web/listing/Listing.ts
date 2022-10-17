import Item from '@/web/listing/Item';
import { asyncEvery, asyncFilter, asyncSome } from '@/utils/array';
import type { EnergyConsumption, IdealistaApiInterface } from '@/common/IdealistaApiInterface';

type FilterPredicate = (item: Item) => Promise<boolean>;

export enum SearchType {
  Highlight = 'highlight',
  Strict = 'strict'
}

export enum AdType {
  All = 'all',
  Private = 'private',
  Agency = 'agency'
}

export enum RentalPeriod {
  All = 'all',
  ShortTerm = 'short_term',
  LongTerm = 'long_term'
}

type SearchFilter = {
  phrases: string[],
  type: SearchType
}

type Filters = {
  search: SearchFilter,
  rentalPeriod: RentalPeriod,
  adType: AdType,
  energyConsumption: EnergyConsumption[]
}

export class Listing {
  private readonly idealistaListing: IdealistaListing;
  private readonly idealistaApi: IdealistaApiInterface;
  private listing!: HTMLElement;
  private items!: Item[];

  constructor(idealistaListing: IdealistaListing, idealistaApi: IdealistaApiInterface) {
    this.idealistaListing = idealistaListing;
    this.idealistaApi = idealistaApi;

    this.loadListing();
  }

  loadListing() {
    this.listing = document.querySelector<HTMLElement>('.items-container')!;
    this.items = [...this.listing.querySelectorAll<HTMLElement>('.item')]
      .map(element => new Item(element, this.idealistaApi));

    this.removeAds();
  }

  async applyFilters(filters: Filters) {
    this.showLoader();

    this.items.forEach(item => item.hide());

    const predicates = this.buildPredicates(filters);

    const matchingItems = await asyncFilter(
      this.items,
      item => asyncEvery(predicates, predicate => predicate(item)),
    );

    this.removeSearchHighlightSearch();

    if (filters.search.phrases.length && filters.search.type === SearchType.Highlight) {
      await this.highlightSearch(filters.search.phrases);
    }

    matchingItems.forEach(item => item.show());

    this.hideLoader();
  }

  private buildPredicates(filters: Filters) {
    const rentalPeriod = {
      [RentalPeriod.All]: () => Promise.resolve(true),
      [RentalPeriod.ShortTerm]: (item: Item) => item.isShortTerm(),
      [RentalPeriod.LongTerm]: (item: Item) => item.isLongTerm(),
    };

    const adType = {
      [AdType.All]: () => Promise.resolve(true),
      [AdType.Private]: (item: Item) => item.isPrivate(),
      [AdType.Agency]: (item: Item) => item.isAgency(),
    };

    const energyConsumption = async (item: Item) => {
      if (!filters.energyConsumption.length) {
        return true;
      }

      const consumption = await item.energyConsumption();

      if (!consumption) {
        return false;
      }

      return filters.energyConsumption.includes(consumption);
    };

    const predicates: FilterPredicate[] = [
      energyConsumption,
      rentalPeriod[filters.rentalPeriod],
      adType[filters.adType],
    ];

    if (filters.search.phrases.length && filters.search.type === SearchType.Strict) {
      predicates.push((item: Item) => asyncSome(
        filters.search.phrases,
        (phrase: string) => item.containsPhrase(phrase),
      ));
    }

    return predicates;
  }

  private async highlightSearch(phrases: string[]) {
    const matchingItems = await asyncFilter(this.items, (item: Item) => asyncSome(
      phrases, (phrase => item.containsPhrase(phrase)),
    ));

    matchingItems.forEach((item) => item.highlight());
  }

  private removeSearchHighlightSearch() {
    this.items.forEach((item) => item.removeHighlight());
  }

  private hideLoader() {
    this.idealistaListing.loading.hide();
  }

  private showLoader() {
    this.idealistaListing.loading.show();
  }

  private removeAds() {
    const ad = this.listing.querySelector('.adv.noHover');

    if (ad) {
      ad.remove();
    }

    const experts = this.listing.querySelector('#experts');

    if (experts) {
      experts.remove();
    }

    this.items.forEach((item) => item.removeAds());
  }
}
