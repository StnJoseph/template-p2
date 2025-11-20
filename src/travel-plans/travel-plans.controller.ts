import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  // POST /travel-plans - Crear un nuevo plan de viaje
  @Post()
  async create(@Body() createTravelPlanDto: CreateTravelPlanDto): Promise<TravelPlanResponseDto> {
    return this.travelPlansService.create(createTravelPlanDto);
  }

  // GET /travel-plans - Listar todos los planes
  @Get()
  async findAll(): Promise<TravelPlanResponseDto[]> {
    return this.travelPlansService.findAll();
  }

  // GET /travel-plans/:id - Obtener un plan específico
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TravelPlanResponseDto> {
    return this.travelPlansService.findOne(id);
  }
}