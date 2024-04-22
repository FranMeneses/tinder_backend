import { Test, TestingModule } from '@nestjs/testing';
import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';
import { Match } from './match.model';
import { CreateMatchDto } from './dtos/create-match.dto';

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
            create: jest.fn().mockImplementation((user1, user2) => ({
              _id: '1',
              user1,
              user2,
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

  describe('createMatch', () => {
    it('should create a new match', async () => {
      const createMatchDto: CreateMatchDto = {
        user1: '123456789012345678901234',
        user2: '123456789012345678901235',
      };

      const result: Match = await resolver.createMatch(createMatchDto);

      expect(result._id).toEqual('1');
      expect(result.user1).toEqual(createMatchDto.user1);
      expect(result.user2).toEqual(createMatchDto.user2);
    });
  });
});