import {Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput{
    @Field()
    password: string;
    @Field()
    mail: string;
}