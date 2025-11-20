export class TravelPlanResponseDto {
  id: number;
  countryCode: string;
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  createdAt: Date;
  country?: {
    code: string;
    name: string;
    flag: string;
  };
}