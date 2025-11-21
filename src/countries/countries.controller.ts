import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryResponseDto } from './dto/country-response.dto';
import { DeleteAuthGuard } from '../common/guards/delete-auth.guard';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  // GET /countries - Listar todos los países
  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.findAll();
  }

  // GET /countries/:code - Obtener país por código
  @Get(':code')
  async findByCode(@Param('code') code: string): Promise<CountryResponseDto> {
    return this.countriesService.findByCode(code);
  }

  // DELETE /countries/:code - Eliminar país
  @Delete(':code')
  @UseGuards(DeleteAuthGuard)
  async remove(@Param('code') code: string): Promise<{ message: string }> {
    return this.countriesService.remove(code);
  }
}