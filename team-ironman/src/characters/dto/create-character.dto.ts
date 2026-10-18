import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { CharacterStatus } from '../status/characterStatus.enum';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  real_name: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  @IsNotEmpty()
  main_power: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  power_level: number;

  @IsEnum(CharacterStatus)
  @IsOptional()
  status?: CharacterStatus;

  @IsBoolean()
  is_villain: boolean;

  @IsNumber()
  @IsOptional()
  team_id?: number;
}