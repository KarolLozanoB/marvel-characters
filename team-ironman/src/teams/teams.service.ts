import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AssignCharactersDto } from './dto/assign-characters.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
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

  async findCharacters(id: number) {
    await this.findOne(id);
    return await this.characterRepository.find({ where: { team_id: id } });
  }

  async create(createTeamDto: CreateTeamDto) {
    const { characterIds, ...teamData } = createTeamDto;

    await this.validateUniqueName(teamData.name);

    if (characterIds && characterIds.length > 0) {
      if (teamData.active === false) {
        throw new BadRequestException('No se pueden asignar personajes a un equipo que no está activo.');
      }
      await this.validateCharactersExist(characterIds);
    }

    const team = this.teamRepository.create(teamData);
    const savedTeam = await this.teamRepository.save(team);

    if (characterIds && characterIds.length > 0) {
      await this.characterRepository.update({ id: In(characterIds) }, { team_id: savedTeam.id });
    }

    return await this.findOneWithCharacters(savedTeam.id);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id);
    await this.validateUniqueName(updateTeamDto.name, id);

    this.teamRepository.merge(team, updateTeamDto);
    return await this.teamRepository.save(team);
  }

  async assignCharacters(id: number, assignCharactersDto: AssignCharactersDto) {
    const team = await this.findOne(id);
    if (!team.active) {
      throw new BadRequestException(`El equipo con ID ${id} no está activo, no se le pueden asignar personajes.`);
    }

    const { characterIds } = assignCharactersDto;
    await this.validateCharactersExist(characterIds);

    await this.characterRepository.update({ id: In(characterIds) }, { team_id: id });

    return await this.findOneWithCharacters(id);
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

  private async findOneWithCharacters(id: number) {
    return await this.teamRepository.findOne({
      where: { id },
      relations: { characters: true },
    });
  }

  private async validateUniqueName(name: string, excludeId?: number) {
    const existingTeam = await this.teamRepository.findOne({ where: { name } });
    if (existingTeam && existingTeam.id !== excludeId) {
      throw new ConflictException(`Ya existe un equipo con el nombre "${name}".`);
    }
  }

  private async validateCharactersExist(characterIds: number[]) {
    const uniqueIds = [...new Set(characterIds)];
    const characters = await this.characterRepository.find({ where: { id: In(uniqueIds) } });

    const foundIds = characters.map((character) => character.id);
    const missingIds = uniqueIds.filter((characterId) => !foundIds.includes(characterId));

    if (missingIds.length > 0) {
      throw new NotFoundException(`Los personajes con ID ${missingIds.join(', ')} no existen.`);
    }
  }
}
