import { Test, TestingModule } from '@nestjs/testing';
import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';

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
            getUserMatches: jest.fn().mockResolvedValue(['123456789012345678901234', '123456789012345678901235']),
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

  describe('getUserMatches', () => {
    it('should return an array of user matches', async () => {
      const userId = '1';

      const result: string[] = await resolver.getUserMatches(userId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual('123456789012345678901234');
      expect(result[1]).toEqual('123456789012345678901235');
    });

    it('should throw an error if there is an error', async () => {
      const userId = '1';

      jest.spyOn(matchService, 'getUserMatches').mockRejectedValueOnce(new Error('Database connection error'));

      await expect(resolver.getUserMatches(userId)).rejects.toThrowError('Database connection error');
    });
  });
});