import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelPlan } from './entities/travel-plan.entity';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectRepository(TravelPlan)
    private readonly travelPlanRepository: Repository<TravelPlan>,
    private readonly countriesService: CountriesService,
  ) {}

  // Crear un nuevo plan de viaje
  async create(createTravelPlanDto: CreateTravelPlanDto): Promise<TravelPlanResponseDto> {
    const { countryCode, title, startDate, endDate, notes } = createTravelPlanDto;

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Verificar que el país exista en la caché (si no existe, lo consulta y guarda)
    const country = await this.countriesService.findByCode(countryCode.toUpperCase());

    // Crear el plan de viaje
    const newTravelPlan = new TravelPlan();
    newTravelPlan.countryCode = countryCode.toUpperCase();
    newTravelPlan.title = title;
    newTravelPlan.startDate = start;
    newTravelPlan.endDate = end;
    newTravelPlan.notes = notes || '';

    // Guardar en la base de datos
    const savedPlan = await this.travelPlanRepository.save(newTravelPlan);

    // Cargar la relación con el país
    const planWithCountry = await this.travelPlanRepository.findOne({
      where: { id: savedPlan.id },
      relations: ['country'],
    });

    // Verificar que se encontró el plan
    if (!planWithCountry) {
      throw new NotFoundException('Travel plan could not be retrieved after creation');
    }

    // Retornar respuesta formateada
    return {
      id: planWithCountry.id,
      countryCode: planWithCountry.countryCode,
      title: planWithCountry.title,
      startDate: planWithCountry.startDate,
      endDate: planWithCountry.endDate,
      notes: planWithCountry.notes,
      createdAt: planWithCountry.createdAt,
      country: {
        code: planWithCountry.country.code,
        name: planWithCountry.country.name,
        flag: planWithCountry.country.flag,
      },
    };
  }

  // Listar todos los planes de viaje
  async findAll(): Promise<TravelPlanResponseDto[]> {
    const plans = await this.travelPlanRepository.find({
      relations: ['country'],
    });

    return plans.map(plan => ({
      id: plan.id,
      countryCode: plan.countryCode,
      title: plan.title,
      startDate: plan.startDate,
      endDate: plan.endDate,
      notes: plan.notes,
      createdAt: plan.createdAt,
      country: {
        code: plan.country.code,
        name: plan.country.name,
        flag: plan.country.flag,
      },
    }));
  }

  // Consultar un plan de viaje por ID
  async findOne(id: number): Promise<TravelPlanResponseDto> {
    const plan = await this.travelPlanRepository.findOne({
      where: { id },
      relations: ['country'],
    });

    if (!plan) {
      throw new NotFoundException(`Travel plan with ID ${id} not found`);
    }

    return {
      id: plan.id,
      countryCode: plan.countryCode,
      title: plan.title,
      startDate: plan.startDate,
      endDate: plan.endDate,
      notes: plan.notes,
      createdAt: plan.createdAt,
      country: {
        code: plan.country.code,
        name: plan.country.name,
        flag: plan.country.flag,
      },
    };
  }
}