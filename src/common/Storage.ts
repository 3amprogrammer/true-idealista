export enum Scheme {
  Filters = 'filters',
  Ads = 'ads',
  Details = 'details',
}

type ChromeStorage = { [key: string]: any } | undefined;

export class Storage {
  async findAll(key: Scheme) {
    const chromeStorage = await chrome.storage.local.get(key);

    return chromeStorage[key] as ChromeStorage;
  }

  async findById(key: Scheme, id: string) {
    const collection = await this.findAll(key);

    if (!collection) {
      return;
    }

    if (!collection.hasOwnProperty(id)) {
      return;
    }

    return collection[id];
  }

  async save(key: Scheme, id: string, value: any) {
    const scheme = await this.findAll(key);

    await chrome.storage.local.set({
      [key]: {
        ...scheme,
        [id]: value,
      },
    });
  }
}