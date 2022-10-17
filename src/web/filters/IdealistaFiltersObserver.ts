import { searchUrlParts } from '@/utils/url';

type Handler = (newFilters: string) => void;

export default class IdealistaFiltersObserver {
  private readonly locationUrl: string;

  private readonly filtersPath: string;

  private readonly handlers: Handler[] = [];

  constructor(config: IdealistaConfig) {
    this.locationUrl = config.locationUri;

    const {filters} = searchUrlParts(config.listingSearchUrl, this.locationUrl);

    this.filtersPath = filters;

    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (pushState, thisArg, [state, title, url]) => {
        if (this.isFiltersChange(state)) {
          const { listingSearchUrl } = state.jsonResponse;

          const { filters } = searchUrlParts(listingSearchUrl, this.locationUrl);

          this.handlers.forEach((handler) => handler(filters));
        }

        return pushState.call(thisArg, state, title, url);
      },
    });
  }

  subscribe(handler: Handler) {
    this.handlers.push(handler);
  }

  private isFiltersChange(state: any) {
    return state?.jsonResponse?.listingSearchUrl;
  }
}