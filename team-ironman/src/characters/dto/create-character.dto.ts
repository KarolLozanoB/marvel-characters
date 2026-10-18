import { IsString, IsNotEmpty, IsInt, Min, Max, IsEnum, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { CharacterStatus } from '../status/characterStatus.enum';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  real_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alias: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  main_power: string;

  @IsInt()
  @Min(1)
  @Max(100)
  power_level: number;

  @IsEnum(CharacterStatus)
  @IsOptional()
  status?: CharacterStatus;

  @IsBoolean()
  is_villain: boolean;

  @IsInt()
  @IsOptional()
  team_id?: number | null;
}
