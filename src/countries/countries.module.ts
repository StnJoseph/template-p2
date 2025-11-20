import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { RestCountriesProvider } from './providers/rest-countries.provider';
import { COUNTRIES_API_PROVIDER } from './providers/countries-api.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    HttpModule, // Para hacer peticiones HTTP
  ],
  controllers: [CountriesController],
  providers: [
    CountriesService,
    {
      provide: COUNTRIES_API_PROVIDER,
      useClass: RestCountriesProvider,
    },
  ],
  exports: [CountriesService], // Exportamos el servicio para usarlo en TravelPlans
})
export class CountriesModule {}