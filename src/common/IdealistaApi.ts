import type { Ad, Details, IdealistaApiInterface } from '@/common/IdealistaApiInterface';
import { type HTMLElement, parse } from 'node-html-parser';
import type { EnergyConsumption } from '@/common/IdealistaApiInterface';

type IdealistaApiConfig = {
  adPath: string,
  domain: string
}

export default class IdealistaApi implements IdealistaApiInterface {
  private readonly config: IdealistaApiConfig;

  constructor(config: IdealistaApiConfig) {
    this.config = config;
  }

  async fetchAd(id: string): Promise<Ad> {
    return this.fetch(`/${this.config.adPath}/${id}/`)
      .then(response => response.text())
      .then(pageHtml => {
        const dom = parse(pageHtml);

        // TODO: Move it to a dedicated class
        const energyConsumption = this.extractEnergyConsumption(dom);
        const description = this.extractDescription(dom);

        return {
          description,
          energyConsumption,
        };
      });
  }

  private extractDescription(dom: HTMLElement): string {
    const commentElement = dom.querySelector('.comment');

    return commentElement ? commentElement.innerText : '';
  }

  private extractEnergyConsumption(dom: HTMLElement): EnergyConsumption | null {
    const node = [...dom.querySelectorAll('[class^="icon-energy"]')]
      .map(a => a.parentNode)
      .find(p => p.innerText.match('Consumo|Classe|Energy'));

    if (!node) {
      return null;
    }

    const spanElement = node.querySelector('span[title]');

    if (!spanElement) {
      return null;
    }

    const titleAttr = spanElement.getAttribute('title');

    return titleAttr ? titleAttr.toUpperCase() as EnergyConsumption : null;
  }

  async fetchDetails(id: string): Promise<Details> {
    return this.fetch(`/en/ajax/listingController/adContactInfoForDetail.ajax?adId=${id}`)
      .then(response => response.json())
      .then(({ data }: { data: Details }) => {
        return data;
      });
  }

  async fetch(urlPart: string) {
    let url = urlPart;
    if (!this.isAbsoluteUrl(urlPart)) {
      url = `${this.config.domain}${urlPart}`;
    }

    return fetch(url).catch(this.retry(url));
  }

  private retry(url: string, timeout: number = 1000) {
    return () => new Promise<Response>((res) => {
      setTimeout(() => fetch(url).then(res), timeout);
    });
  }

  private isAbsoluteUrl(url: string) {
    try {
      new URL(url);
    } catch (e) {
      return false;
    }

    return true;
  }
}
