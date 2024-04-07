import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
@ObjectType()
export class Users extends mongoose.Document {
    @Field(() => String)
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    @Field()
    name: string;

    @Prop()
    @Field({ nullable: true })
    description?: string;

    @Prop({ required: true, unique: true })
    @Field()
    mail: string;

    @Prop({ required: true })
    @Field()
    password: string;

    @Prop()
    @Field({ nullable: true })
    phone?: string;

    @Prop()
    @Field({ nullable: true })
    career?: string;

    @Prop()
    @Field(() => Int, { nullable: true })
    year?: number;

    @Prop()
    @Field({ nullable: true })
    photo?: string;
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], default: [] })
    @Field(type => [ID], { nullable: 'itemsAndList' })
    likes: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(Users);
