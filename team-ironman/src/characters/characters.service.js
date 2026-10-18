"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharactersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const character_entity_1 = require("./entities/character.entity");
const team_entity_1 = require("../teams/entities/team.entity");
const characterStatus_enum_1 = require("./status/characterStatus.enum");
let CharactersService = class CharactersService {
    characterRepository;
    teamRepository;
    constructor(characterRepository, teamRepository) {
        this.characterRepository = characterRepository;
        this.teamRepository = teamRepository;
    }
    async findAll(status, teamId) {
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
    async findOne(id) {
        const character = await this.characterRepository.findOne({
            where: { id },
            relations: { team: true, },
        });
        if (!character) {
            throw new common_1.NotFoundException(`El personaje con ID ${id} no existe.`);
        }
        return character;
    }
    async create(createCharacterDto) {
        const existingAlias = await this.characterRepository.findOne({ where: { alias: createCharacterDto.alias } });
        if (existingAlias) {
            throw new common_1.ConflictException(`Ya existe un personaje con el alias "${createCharacterDto.alias}".`);
        }
        if (createCharacterDto.team_id) {
            const team = await this.teamRepository.findOne({ where: { id: createCharacterDto.team_id } });
            if (!team) {
                throw new common_1.NotFoundException(`El equipo con ID ${createCharacterDto.team_id} no existe.`);
            }
            if (!team.active) {
                throw new common_1.BadRequestException(`El equipo al que intenta asociar el personaje no está activo.`);
            }
        }
        const character = this.characterRepository.create(createCharacterDto);
        return await this.characterRepository.save(character);
    }
    async updateStatus(id, updateStatusDto) {
        const character = await this.findOne(id);
        const currentStatus = character.status;
        const newStatus = updateStatusDto.status;
        if (currentStatus === characterStatus_enum_1.CharacterStatus.RETIRED && newStatus === characterStatus_enum_1.CharacterStatus.INJURED) {
            throw new common_1.BadRequestException('Un personaje en estado RETIRED no puede pasar directamente a INJURED. Debe volver a ACTIVE primero.');
        }
        character.status = newStatus;
        return await this.characterRepository.save(character);
    }
    async remove(id) {
        const character = await this.findOne(id);
        await this.characterRepository.remove(character);
        return { message: `El personaje con ID ${id} ha sido eliminado exitosamente.` };
    }
};
exports.CharactersService = CharactersService;
exports.CharactersService = CharactersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(character_entity_1.Character)),
    __param(1, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CharactersService);
//# sourceMappingURL=characters.service.js.map