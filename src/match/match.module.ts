import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchService } from './match.service';
import { MatchResolver } from './match.resolver';
import { Match, MatchSchema } from './match.model';
import { UsersModule } from '../users/users.module';
import { Users, UserSchema } from '../users/users.entity';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }])
  ],
  providers: [MatchService, MatchResolver],
  exports: [MatchService]
})
export class MatchModule {}