import type { Ad, Details, IdealistaApiInterface } from '@/common/IdealistaApiInterface';
import { type HTMLElement, parse } from 'node-html-parser';
import type { EnergyConsumption } from '@/common/IdealistaApiInterface';

export default class IdealistaApi implements IdealistaApiInterface {
  async fetchAd(id: string): Promise<Ad> {
    return this.fetch(`/inmueble/${id}/`)
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
      // TODO: Account for different language
      .find(p => p.innerText.match('Consumo'));

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
    return this.fetch(`/es/ajax/listingController/adContactInfoForDetail.ajax?adId=${id}`)
      .then(response => response.json())
      .then(({ data }: { data: Details }) => {
        return data;
      });
  }

  async fetch(urlPart: string) {
    const url = `https://www.idealista.com${urlPart}`;

    return fetch(url).catch(this.retry(url));
  }

  private retry(url: string, timeout: number = 1000) {
    return () => new Promise<Response>((res) => {
      setTimeout(() => fetch(url).then(res), timeout);
    });
  }
}
