import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './users.entity';
import { CreateUserInput } from './dtos/create-user.input';
import { LoginUserInput } from './dtos/user-login.input';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserInput } from './dtos/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private jwtService: JwtService
  ) { }

  async findAll(): Promise<Users[]> {
    return this.usersModel.find().exec();
  }

  async createUser(user: CreateUserInput): Promise<boolean> {
    try {
      const newUser = new this.usersModel(user);
      await newUser.save();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  async loginUserTest(user: LoginUserInput): Promise<string | null> {
    const foundUser = await this.usersModel.findOne({ mail: user.mail }).exec();
    if (foundUser && foundUser.password === user.password) {
      return this.jwtService.sign({ email: foundUser.mail });
    }
    return null;
  }

  async showInfo(correo: string): Promise<Users | null> {
    return this.usersModel.findOne({ mail: correo }).exec();
  }

  async updateUser(userId: string, user: UpdateUserInput): Promise<boolean> {
    try {
      const updatedUser = await this.usersModel.findByIdAndUpdate(userId, user, { new: true }).exec();
      return updatedUser != null;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await this.usersModel.findByIdAndDelete(userId).exec();
      return result != null;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
