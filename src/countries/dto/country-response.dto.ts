export class CountryResponseDto {
  code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flag: string;
  source: 'cache' | 'external'; // Indica si viene de BD o API externa
  createdAt?: Date;
  updatedAt?: Date;
}