import { CharacterStatus } from '../status/characterStatus.enum';
export declare class CreateCharacterDto {
    real_name: string;
    alias: string;
    main_power: string;
    power_level: number;
    status?: CharacterStatus;
    is_villain: boolean;
    team_id?: number;
}
