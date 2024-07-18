import { containsPhrase } from '@/utils/string';
import type { IdealistaApiInterface } from '@/common/IdealistaApiInterface';

export default class Item {
  private readonly element: HTMLElement;
  private readonly idealistaApi: IdealistaApiInterface;

  constructor(element: HTMLElement, idealistaApi: IdealistaApiInterface) {
    this.element = element;
    this.idealistaApi = idealistaApi;
  }

  id() {
    return this.element.dataset.elementId!;
  }

  shortDescription() {
    const element = this.element.querySelector<HTMLElement>('.ellipsis');

    if (!element) {
      return '';
    }

    return element.innerText;
  }

  containsBranding() {
    return this.element.classList.contains('item_contains_branding');
  }

  hide() {
    this.element.style.display = 'none';
  }

  show() {
    this.element.style.display = '';
  }

  highlight() {
    const infoElement = this.element.querySelector<HTMLElement>('.item-info-container');

    if (infoElement) {
      infoElement.style.background = 'rgb(225 245 110 / 50%)';
    }
  }

  removeHighlight() {
    const infoElement = this.element.querySelector<HTMLElement>('.item-info-container');

    if (infoElement) {
      infoElement.style.background = '';
    }
  }

  async fullDescription() {
    const ad = await this.idealistaApi.fetchAd(this.id());

    return ad.description;
  }

  async energyConsumption() {
    const ad = await this.idealistaApi.fetchAd(this.id());

    return ad.energyConsumption;
  }

  async isShortTerm() {
    const temporalIndicators = [
      '\btempora',
      '\bseasonal',
      'rendas mensais',
      'affitto breve',
      'brevi periodi',
      'short-term',
      'short period',
      'short',
      '11 (months|meses)'
    ];

    const temporalIndicatorsPattern = temporalIndicators.join('|');

    if (containsPhrase(this.shortDescription(), temporalIndicatorsPattern)) {
      return true;
    }

    return containsPhrase(await this.fullDescription(), temporalIndicatorsPattern);
  }

  async isLongTerm() {
    return !(await this.isShortTerm());
  }

  async containsPhrase(phrase: string) {
    if (containsPhrase(this.shortDescription(), phrase)) {
      return true;
    }

    return containsPhrase(await this.fullDescription(), phrase);
  }

  async isAgency() {
    if (this.containsBranding()) {
      return true;
    }

    const details = await this.idealistaApi.fetchDetails(this.id());

    return details.isAdProfessional;
  }

  async isPrivate() {
    return !(await this.isAgency());
  }

  removeAds() {
    this.element.classList.remove('item_featured', 'item_highlight-phrase');

    const highlightPhrase = this.element.querySelector('.item-highlight-phrase');

    if (highlightPhrase) {
      highlightPhrase.remove();
    }
  }
}
