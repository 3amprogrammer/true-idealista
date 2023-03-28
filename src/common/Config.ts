export enum Locale {
  es = 'es',
  pt = 'pt',
  it = 'it'
}

export const locales = [Locale.es, Locale.pt, Locale.it];

type LocaleConfig = {
  domain: string,
  adPath: string
}

type Config = { [key in Locale]: LocaleConfig }

export const config: Config = {
  es: {
    domain: 'https://www.idealista.com',
    adPath: 'inmueble',
  },
  pt: {
    domain: 'https://www.idealista.pt',
    adPath: 'imovel',
  },
  it: {
    domain: 'https://www.idealista.it',
    adPath: 'immobile',
  },
};
