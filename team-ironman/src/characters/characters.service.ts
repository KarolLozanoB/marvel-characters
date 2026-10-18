import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { Team } from '../teams/entities/team.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { UpdateStatusDto } from './status/update-characterStatus.dto';
import { CharacterStatus } from './status/characterStatus.enum';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll(status?: CharacterStatus, teamId?: number) {
    const query = this.characterRepository.createQueryBuilder('character')
      .leftJoinAndSelect('character.team', 'team');

    if (status) {
      query.andWhere('character.status = :status', { status });
    }
    if (teamId) {
      query.andWhere('character.team_id = :teamId', { teamId });
    }

    return await query.getMany();
  }

  async findOne(id: number) {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: { team: true,},
    });
    if (!character) {
      throw new NotFoundException(`El personaje con ID ${id} no existe.`);
    }
    return character;
  }

  async create(createCharacterDto: CreateCharacterDto) {
    await this.validateUniqueAlias(createCharacterDto.alias);

    if (createCharacterDto.team_id) {
      await this.validateTeam(createCharacterDto.team_id);
    }

    const character = this.characterRepository.create(createCharacterDto);
    return await this.characterRepository.save(character);
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    const character = await this.characterRepository.findOne({ where: { id } });
    if (!character) {
      throw new NotFoundException(`El personaje con ID ${id} no existe.`);
    }

    await this.validateUniqueAlias(updateCharacterDto.alias, id);

    if (updateCharacterDto.team_id) {
      await this.validateTeam(updateCharacterDto.team_id);
    }

    if (updateCharacterDto.status) {
      this.validateStatusChange(character.status, updateCharacterDto.status);
    }

    Object.assign(character, updateCharacterDto);
    await this.characterRepository.save(character);

    return await this.findOne(id);
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
    const character = await this.findOne(id);

    this.validateStatusChange(character.status, updateStatusDto.status);

    character.status = updateStatusDto.status;
    return await this.characterRepository.save(character);
  }

  async remove(id: number) {
    const character = await this.findOne(id);
    await this.characterRepository.remove(character);
    return { message: `El personaje con ID ${id} ha sido eliminado exitosamente.` };
  }

  private async validateUniqueAlias(alias: string, excludeId?: number) {
    const existingAlias = await this.characterRepository.findOne({ where: { alias } });
    if (existingAlias && existingAlias.id !== excludeId) {
      throw new ConflictException(`Ya existe un personaje con el alias "${alias}".`);
    }
  }

  private async validateTeam(teamId: number) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`El equipo con ID ${teamId} no existe.`);
    }
    if (!team.active) {
      throw new BadRequestException(`El equipo al que intenta asociar el personaje no está activo.`);
    }
  }

  private validateStatusChange(currentStatus: CharacterStatus, newStatus: CharacterStatus) {
    if (currentStatus === CharacterStatus.RETIRED && newStatus === CharacterStatus.INJURED) {
      throw new BadRequestException('Un personaje en estado RETIRED no puede pasar directamente a INJURED. Debe volver a ACTIVE primero.');
    }
  }
}
