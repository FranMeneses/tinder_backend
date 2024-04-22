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
            checkMatch: jest.fn().mockImplementation((loggedInUser, likedUser) => {
              if (loggedInUser === '1' && likedUser === '2') {
                return true;
              } else {
                return false;
              }
            }),
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

  describe('getMatch', () => {
    it('should return true if there is a match', async () => {
      const loggedInUser = '1';
      const likedUser = '2';

      const result: boolean = await resolver.getMatch(loggedInUser, likedUser);

      expect(result).toEqual(true);
    });

    it('should return false if there is no match', async () => {
      const loggedInUser = '2';
      const likedUser = '3';

      const result: boolean = await resolver.getMatch(loggedInUser, likedUser);

      expect(result).toEqual(false);
    });
  });
});