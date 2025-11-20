// Contrato/Interfaz que define el servicio
export interface ICountriesApiProvider {
  findCountryByCode(code: string): Promise<any>;
}

export const COUNTRIES_API_PROVIDER = 'COUNTRIES_API_PROVIDER';