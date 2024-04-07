import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMatchDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  user1: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  user2: string;
}