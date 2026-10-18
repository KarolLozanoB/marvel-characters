import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {CharactersModule} from './characters/characters.module';
import {TeamsModule} from './teams/teams.module';


@Module({
  imports: [TeamsModule, CharactersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,          
      username: 'marvel',  
      password: 'marvel123',
      database: 'marvel_db',
      autoLoadEntities: true,
      synchronize: false,  // Muy importante en false para no alterar las tablas existentes!!
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}