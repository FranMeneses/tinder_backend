import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length, Max, Min } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  mail?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  password?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  phone?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  career?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  year?: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  photo?: string;
}
