import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MatchService } from './match.service';
import { Match } from './match.model';
import { CreateMatchDto } from './dtos/create-match.dto';

@Resolver(of => Match)
export class MatchResolver {
  constructor(private matchService: MatchService) {}

  @Query(returns => [Match])
  async matches() {
    return this.matchService.findAll();
  }

  @Mutation(returns => Match)
  async createMatch(
    @Args('createMatchDto') createMatchDto: CreateMatchDto,
  ) {
    const { user1, user2 } = createMatchDto;
    return this.matchService.create(user1, user2);
  }
}