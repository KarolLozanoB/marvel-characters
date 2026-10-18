import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity({ name: 'teams' })
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    base: string;

    @Column({ nullable: true })
    founded_year: number;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    
    @OneToMany(() => Character, (character) => character.team)
    characters: Character[];





}
