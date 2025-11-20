import { IsString, IsNotEmpty, IsDateString, IsOptional, Length, Matches } from 'class-validator';

export class CreateTravelPlanDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, { message: 'countryCode must be a valid alpha-3 code (e.g., COL, USA)' })
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string; // Formato ISO: "2024-12-01"

  @IsDateString()
  @IsNotEmpty()
  endDate: string; // Formato ISO: "2024-12-15"

  @IsString()
  @IsOptional()
  notes?: string;
}