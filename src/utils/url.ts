import { trim } from './string';

export const searchUrlParts = (fullSearchUrl: string, locationPart: string) => {
  const [listingType, filters] = fullSearchUrl.split(locationPart).map(i => trim(i, '/'));

  return {listingType, filters};
};