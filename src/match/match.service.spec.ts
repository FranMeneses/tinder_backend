import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: 'MatchModel',
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: 'UsersModel',
          useValue: {
            findById: jest.fn().mockResolvedValue({ likes: [] }),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('likeUser', () => {
    it('should create a match if the liked user also likes the user', async () => {
      const userId = new Types.ObjectId().toHexString();
      const likedUserId = new Types.ObjectId().toHexString();
      const match = { user1: userId, user2: likedUserId };
  
      jest.spyOn(service['userModel'], 'findOneAndUpdate').mockResolvedValue({ likes: [] } as any);
      jest.spyOn(service['userModel'], 'findById').mockResolvedValue({ likes: [userId] } as any);
      jest.spyOn(service, 'create').mockResolvedValue(match as any);
  
      const result = await service.likeUser(userId, likedUserId);
  
      expect(result).toEqual(match);
    });
  
    it('should not create a match if the liked user does not like the user', async () => {
      const userId = new Types.ObjectId().toHexString();
      const likedUserId = new Types.ObjectId().toHexString();
  
      jest.spyOn(service['userModel'], 'findOneAndUpdate').mockResolvedValue({ likes: [] } as any);
      jest.spyOn(service['userModel'], 'findById').mockResolvedValue({ likes: [] } as any);
  
      const result = await service.likeUser(userId, likedUserId);
  
      expect(result).toBeNull();
    });
  
    it('should throw an error if userModel.findOneAndUpdate throws an error', async () => {
      const userId = new Types.ObjectId().toHexString();
      const likedUserId = new Types.ObjectId().toHexString();
      const error = new Error('An error occurred');
  
      jest.spyOn(service['userModel'], 'findOneAndUpdate').mockRejectedValue(error);
  
      await expect(service.likeUser(userId, likedUserId)).rejects.toThrow(error);
    });
  
    it('should throw an error if userModel.findById throws an error', async () => {
      const userId = new Types.ObjectId().toHexString();
      const likedUserId = new Types.ObjectId().toHexString();
      const error = new Error('An error occurred');
  
      jest.spyOn(service['userModel'], 'findOneAndUpdate').mockResolvedValue({ likes: [] } as any);
      jest.spyOn(service['userModel'], 'findById').mockRejectedValue(error);
  
      await expect(service.likeUser(userId, likedUserId)).rejects.toThrow(error);
    });
  });

  describe('checkMatch', () => {
    it('should return a boolean', async () => {
      const user1 = '6625c94e488717b4d1f358d4';
      const user2 = '6625c95d488717b4d1f358d6';
      const result = true;
      jest.spyOn(service, 'checkMatch').mockImplementation(() => Promise.resolve(result));
  
      expect(await service.checkMatch(user1, user2)).toBe(result);
    });
  
    it('should return true when both users have liked each other', async () => {
      const user1 = '6625c94e488717b4d1f358d4';
      const user2 = '6625c95d488717b4d1f358d6';
      const user1Likes = [user2];
      const user2Likes = [user1];
  
      jest.spyOn(service['userModel'], 'findById')
        .mockResolvedValueOnce({ likes: user1Likes } as any)
        .mockResolvedValueOnce({ likes: user2Likes } as any);
  
      const result = await service.checkMatch(user1, user2);
  
      expect(result).toBe(true);
    });
  
    it('should return false when one user has not liked the other', async () => {
      const user1 = '6625c94e488717b4d1f358d4';
      const user2 = '6625c95d488717b4d1f358d6';
      const user1Likes = [user2];
      const user2Likes = [];
  
      jest.spyOn(service['userModel'], 'findById')
        .mockResolvedValueOnce({ likes: user1Likes } as any)
        .mockResolvedValueOnce({ likes: user2Likes } as any);
  
      const result = await service.checkMatch(user1, user2);
  
      expect(result).toBe(false);
    });
  });

  describe('getUserMatches', () => {
    it('should return the ids of the matched users', async () => {
      const userId = '6625c94e488717b4d1f358d4';
      const matches = [
        { user1: userId, user2: 'user2Id', _id: new ObjectId(), __v: 0 },
        { user1: 'user3Id', user2: userId, _id: new ObjectId(), __v: 0 },
      ];
  
      jest.spyOn(service['matchModel'], 'find').mockResolvedValue(matches as any);
  
      const result = await service.getUserMatches(userId);
  
      expect(result).toEqual(['user2Id', 'user3Id']);
    });
  
    it('should return an empty array when the user has no matches', async () => {
      const userId = '6625c94e488717b4d1f358d4';
  
      jest.spyOn(service['matchModel'], 'find').mockResolvedValue([] as any);
  
      const result = await service.getUserMatches(userId);
  
      expect(result).toEqual([]);
    });

    it('should throw an error if matchModel.find throws an error', async () => {
      const userId = '6625c94e488717b4d1f358d4';
      const error = new Error('An error occurred');
    
      jest.spyOn(service['matchModel'], 'find').mockRejectedValue(error);
    
      await expect(service.getUserMatches(userId)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all matches', async () => {
      const matches = [{ user1: 'user1Id', user2: 'user2Id' }];
  
      jest.spyOn(service['matchModel'], 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(matches),
      } as any);
  
      const result = await service.findAll();
  
      expect(result).toEqual(matches);
    });
  
    it('should return an empty array when there are no matches', async () => {
      jest.spyOn(service['matchModel'], 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);
  
      const result = await service.findAll();
  
      expect(result).toEqual([]);
    });
  });
});