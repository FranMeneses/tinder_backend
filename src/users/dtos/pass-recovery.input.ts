import {Field, InputType } from '@nestjs/graphql';

@InputType()
export class RecoveryPassInput{
    @Field()
    correo: string;
}