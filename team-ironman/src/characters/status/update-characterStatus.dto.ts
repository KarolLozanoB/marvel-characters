import { IsEnum, IsNotEmpty } from 'class-validator';
import { CharacterStatus } from './characterStatus.enum';

export class UpdateStatusDto {
  @IsEnum(CharacterStatus)
  @IsNotEmpty()
  status: CharacterStatus;
}