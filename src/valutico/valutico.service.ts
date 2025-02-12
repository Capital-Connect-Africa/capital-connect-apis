import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ValuticoService {
  private readonly baseUrl = 'https://api.valutico.com/marketplaces';

  constructor(private readonly httpService: HttpService) {}

  async getMarketplace(myValuticoId: string) {
    const url = `${this.baseUrl}/${myValuticoId}`;
    const response = await this.httpService.get(url).toPromise();
    return response.data;
  }

  async submitValuation(myValuticoId: string, valuationData: any) {
    const url = `${this.baseUrl}/${myValuticoId}/valuations`;
    const response = await this.httpService
      .post(url, valuationData)
      .toPromise();
    return response.data;
  }
}
