import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
export declare class TeamsService {
    private readonly teamRepository;
    constructor(teamRepository: Repository<Team>);
    findAll(): Promise<Team[]>;
    findOne(id: number): Promise<Team>;
    create(createTeamDto: CreateTeamDto): Promise<Team>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
