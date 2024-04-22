import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from './match.model';
import { Users } from '../users/users.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Users.name) private userModel: Model<Users>,
  ) {}

  async create(user1: string, user2: string): Promise<Match> {
    const existingMatch = await this.matchModel.findOne({
      $or: [
        { user1: user1, user2: user2 },
        { user1: user2, user2: user1 },
      ],
    });

    if (existingMatch) {
      throw new Error('Match already exists');
    }

    const match = new this.matchModel({ user1, user2 });
    return match.save();
  }

  async likeUser(userId: string, likedUserId: string): Promise<Match | null> {
    const likedUserIdAsObjectId = new Types.ObjectId(likedUserId);
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { likes: likedUserIdAsObjectId } },
      { new: true }
    );
  
    const likedUser = await this.userModel.findById(likedUserId);
    const likedUserLikesIds = likedUser.likes.map(id => id.toString());
  
    if (likedUserLikesIds.includes(userId)) {
      return this.create(userId, likedUserId);
    }
  
    return null;
  }

  async checkMatch(user1: string, user2: string): Promise<boolean> {
    const user1Likes = (await this.userModel.findById(user1)).likes.map(id => id.toString());
    const user2Likes = (await this.userModel.findById(user2)).likes.map(id => id.toString());
    return user1Likes.includes(user2) && user2Likes.includes(user1);
  }

  async getUserMatches(userId: string): Promise<string[]> {
    const matches = await this.matchModel.find({
      $or: [{ user1: userId }, { user2: userId }],
    });
    return matches.map(match => (match.user1.toString() === userId ? match.user2.toString() : match.user1.toString()));
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }
}