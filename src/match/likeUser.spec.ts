import { Test, TestingModule } from '@nestjs/testing';
import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';
import { Match } from './match.model';

describe('MatchResolver', () => {
  let resolver: MatchResolver;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchResolver,
        {
          provide: MatchService,
          useValue: {
            likeUser: jest.fn().mockImplementation((userId, likedUserId) => ({
              _id: '1',
              user1: userId,
              user2: likedUserId,
            })),
          },
        },
      ],
    }).compile();

    resolver = module.get<MatchResolver>(MatchResolver);
    matchService = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('likeUser', () => {
    it('should create a new match when the user likes another user', async () => {
      const userId = '1';
      const likedUserId = '2';

      const result: Match = await resolver.likeUser(userId, likedUserId);

      expect(result._id).toEqual('1');
      expect(result.user1).toEqual(userId);
      expect(result.user2).toEqual(likedUserId);
    });

    it('should return null if there is an error', async () => {
      const userId = '1';
      const likedUserId = '2';

      jest.spyOn(matchService, 'likeUser').mockRejectedValueOnce(new Error('Database connection error'));

      await expect(resolver.likeUser(userId, likedUserId)).rejects.toThrowError('Database connection error');
    });
  });
});