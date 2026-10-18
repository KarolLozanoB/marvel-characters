import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateStatusDto } from './status/update-characterStatus.dto';
import { CharacterStatus } from './status/characterStatus.enum';
export declare class CharactersController {
    private readonly charactersService;
    constructor(charactersService: CharactersService);
    findAll(status?: CharacterStatus, teamId?: number): Promise<import("./entities/character.entity").Character[]>;
    findOne(id: number): Promise<import("./entities/character.entity").Character>;
    create(createCharacterDto: CreateCharacterDto): Promise<import("./entities/character.entity").Character>;
    updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<import("./entities/character.entity").Character>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
