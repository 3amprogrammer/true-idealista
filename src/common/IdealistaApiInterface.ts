export type Details = {
  isAdProfessional: boolean
}

export enum EnergyConsumption {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G'
}

export type Ad = {
  description: string,
  energyConsumption: EnergyConsumption | null
}

export interface IdealistaApiInterface {
  fetchAd(id: string): Promise<Ad>;

  fetchDetails(id: string): Promise<Details>;

  fetch(urlPart: string): Promise<Response>;
}
