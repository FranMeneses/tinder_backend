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

  async findAll(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }
}