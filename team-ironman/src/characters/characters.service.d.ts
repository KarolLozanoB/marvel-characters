import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { Team } from '../teams/entities/team.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateStatusDto } from './status/update-characterStatus.dto';
import { CharacterStatus } from './status/characterStatus.enum';
export declare class CharactersService {
    private readonly characterRepository;
    private readonly teamRepository;
    constructor(characterRepository: Repository<Character>, teamRepository: Repository<Team>);
    findAll(status?: CharacterStatus, teamId?: number): Promise<Character[]>;
    findOne(id: number): Promise<Character>;
    create(createCharacterDto: CreateCharacterDto): Promise<Character>;
    updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<Character>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
