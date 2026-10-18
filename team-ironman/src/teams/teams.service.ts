import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll() {
    return await this.teamRepository.find();
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`El equipo con ID ${id} no existe.`);
    }
    return team;
  }

  async create(createTeamDto: CreateTeamDto) {
    const existingTeam = await this.teamRepository.findOne({ where: { name: createTeamDto.name } });
    if (existingTeam) {
      throw new ConflictException(`Ya existe un equipo con el nombre "${createTeamDto.name}".`);
    }

    const team = this.teamRepository.create(createTeamDto);
    return await this.teamRepository.save(team);
  }

  async update(id: number, updateTeamDto: any) {
  const team = await this.findOne(id);
  this.teamRepository.merge(team, updateTeamDto);
  return await this.teamRepository.save(team);
}

  async remove(id: number) {
  const team = await this.teamRepository.findOne({
    where: { id },
    relations: {
    characters: true,
  },
  });

  if (!team) {
    throw new NotFoundException(`El equipo con ID ${id} no existe.`);
  }

  if (team.characters && team.characters.length > 0) {
    throw new ConflictException('No se puede eliminar un equipo que tenga personajes asociados.');
  }

  await this.teamRepository.remove(team);
  return { message: `El equipo con ID ${id} ha sido eliminado exitosamente.` };
}
}