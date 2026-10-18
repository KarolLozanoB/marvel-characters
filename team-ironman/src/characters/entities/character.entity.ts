import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CharacterStatus } from '../status/characterStatus.enum';
import { Team } from '../../teams/entities/team.entity'; //

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  real_name: string;

  @Column({ unique: true })
  alias: string;

  @Column()
  main_power: string;

  @Column()
  power_level: number;

  @Column({
    type: 'enum',
    enum: CharacterStatus,
    default: CharacterStatus.ACTIVE,
  })
  status: CharacterStatus;

  @Column()
  is_villain: boolean;

  @Column({ nullable: true })
  team_id: number; 

  
  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}