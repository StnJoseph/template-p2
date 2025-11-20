import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ICountriesApiProvider } from './countries-api.interface';

@Injectable()
export class RestCountriesProvider implements ICountriesApiProvider {
  private readonly baseUrl = 'https://restcountries.com/v3.1';

  constructor(private readonly httpService: HttpService) {}

  async findCountryByCode(code: string): Promise<any> {
    try {
      // Solicitar solo los campos que necesitamos
      const fields = 'name,cca3,region,subregion,capital,population,flags';
      const url = `${this.baseUrl}/alpha/${code}?fields=${fields}`;

      const response = await firstValueFrom(
        this.httpService.get(url)
      );

      const data = response.data;

      // Transformar la respuesta al formato que necesitamos
      return {
        code: data.cca3,
        name: data.name.common,
        region: data.region,
        subregion: data.subregion || '',
        capital: data.capital ? data.capital[0] : '',
        population: data.population,
        flag: data.flags.png,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `Country with code ${code} not found in external API`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Error fetching data from external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}