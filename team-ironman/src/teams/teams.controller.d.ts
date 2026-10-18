import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    findAll(): Promise<import("./entities/team.entity").Team[]>;
    findOne(id: number): Promise<import("./entities/team.entity").Team>;
    create(createTeamDto: CreateTeamDto): Promise<import("./entities/team.entity").Team>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
