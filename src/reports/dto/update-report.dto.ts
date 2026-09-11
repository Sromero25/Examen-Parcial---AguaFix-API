import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  severity?: string;

  @IsOptional()
  @IsString()
  reporterPhone?: string;

  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;
}