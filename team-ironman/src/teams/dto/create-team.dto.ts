import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsArray, Min, Max, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  base?: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  founded_year?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  characterIds?: number[];
}
