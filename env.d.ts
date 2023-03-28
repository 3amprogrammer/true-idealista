/// <reference types="vite/client" />
export {};

declare global {
  type IdealistaConfig = {
    operationName: string
    mapMode: number
    listingSearchUrl: string
    locationUri: string,
    searchWithoutFilters: string,
    locale: string
  };

  type IdealistaListing = {
    loading: {
      show: () => void
      hide: () => void
    },
  }

  interface Window {
    readonly config: IdealistaConfig;
    readonly listing: IdealistaListing;
  }

  const LOGGER_COLOR: string;
  const LOGGER_DEBUG: boolean;
}
