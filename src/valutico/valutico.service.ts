import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ValuticoService {
  private readonly baseUrl = 'https://app.demo.valutico.dev/api';

  constructor(private readonly httpService: HttpService) {}

  async getMarketplace() {
    const url = `${this.baseUrl}/marketplaces/default`;
    const response = await this.httpService.get(url).toPromise();
    return response.data;
  }

  async submitValuation(valuationData: any) {
    const url = `${this.baseUrl}/marketplaces/default/valuations`;
    const response = await this.httpService
      .post(url, valuationData)
      .toPromise();
    return response.data;
  }

  async getCountries() {
    const url = `${this.baseUrl}/finance_countries?term=:param&flat=true&locale=en`;
    const response = await this.httpService.get(url).toPromise();
    return response.data;
  }

  async getIndustries() {
    const url = `${this.baseUrl}/nace_industries?term=:param&flat=true&locale=en`;
    const response = await this.httpService.get(url).toPromise();
    return response.data;
  }

  async getPeers() {
    const url = `${this.baseUrl}/peers?term=:param&flat=true`;
    const response = await this.httpService.get(url).toPromise();
    return response.data;
  }
}
