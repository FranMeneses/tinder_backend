import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../users/users.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class Match extends Document {
  @Field(type => String)
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user1: Types.ObjectId;

  @Field(type => String)
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user2: Types.ObjectId;
}

export const MatchSchema = SchemaFactory.createForClass(Match);