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

  @Mutation(returns => Boolean)
  async getMatch(
    @Args('loggedInUser') loggedInUser: string,
    @Args('likedUser') likedUser: string,
  ) {
    return this.matchService.checkMatch(loggedInUser, likedUser);
  }

  @Mutation(returns => Match, { nullable: true })
  async likeUser(
    @Args('userId') userId: string,
    @Args('likedUserId') likedUserId: string,
  ) {
    return this.matchService.likeUser(userId, likedUserId);
  }
}