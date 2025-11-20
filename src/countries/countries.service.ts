import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CountryResponseDto } from './dto/country-response.dto';
import type { ICountriesApiProvider } from './providers/countries-api.interface';
import { COUNTRIES_API_PROVIDER } from './providers/countries-api.interface';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    
    @Inject(COUNTRIES_API_PROVIDER)
    private readonly countriesApiProvider: ICountriesApiProvider,
  ) {}

  // Listar todos los países en la BD
  async findAll(): Promise<CountryResponseDto[]> {
    const countries = await this.countryRepository.find();
    
    return countries.map(country => ({
      ...country,
      source: 'cache' as const,
    }));
  }

  // Buscar país por código con lógica de caché
  async findByCode(code: string): Promise<CountryResponseDto> {
    const upperCode = code.toUpperCase();

    // 1. Buscar primero en la base de datos (caché)
    let country = await this.countryRepository.findOne({
        where: { code: upperCode },
    });

    // 2. Si existe en caché, devolverlo
    if (country) {
        return {
        code: country.code,
        name: country.name,
        region: country.region,
        subregion: country.subregion,
        capital: country.capital,
        population: country.population,
        flag: country.flag,
        createdAt: country.createdAt,
        updatedAt: country.updatedAt,
        source: 'cache',
        };
    }

    // 3. Si no existe, consultar la API externa
    const externalData = await this.countriesApiProvider.findCountryByCode(upperCode);

    // 4. Crear la entidad
    const newCountry = new Country();
    newCountry.code = externalData.code;
    newCountry.name = externalData.name;
    newCountry.region = externalData.region;
    newCountry.subregion = externalData.subregion;
    newCountry.capital = externalData.capital;
    newCountry.population = externalData.population;
    newCountry.flag = externalData.flag;

    // 5. Guardar en la base de datos
    const savedCountry = await this.countryRepository.save(newCountry);

    // 6. Devolver indicando que viene de la API externa
    return {
        code: savedCountry.code,
        name: savedCountry.name,
        region: savedCountry.region,
        subregion: savedCountry.subregion,
        capital: savedCountry.capital,
        population: savedCountry.population,
        flag: savedCountry.flag,
        createdAt: savedCountry.createdAt,
        updatedAt: savedCountry.updatedAt,
        source: 'external',
    };
    }
}