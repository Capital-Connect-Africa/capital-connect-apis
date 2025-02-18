import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ValuticoService {
  private readonly baseUrl = 'https://app.demo.valutico.dev/api/marketplaces/default';

  constructor(private readonly httpService: HttpService) {}

  async getMarketplace() {
    const response = await this.httpService.get(this.baseUrl).toPromise();
    return response.data;
  }

  async submitValuation(valuationData: any) {
    const url = `${this.baseUrl}/valuations`;
    const response = await this.httpService
      .post(url, valuationData)
      .toPromise();
    return response.data;
  }
}
