import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { isDate, IsEmail, isString, Length } from "class-validator";
import { Cart, CartInput } from "./Cart";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryAdress: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  createdDate: Date;

  @Field(() => [Cart])
  @ManyToOne(() => Cart, "user", { onDelete: "CASCADE" })
  carts: Cart[];
}

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Length(8, 60)
  password: string;

  @Field({ nullable: true })
  firstname: string;

  @Field({ nullable: true })
  lastname: string;

  @Field({ nullable: true })
  deliveryAdress: string;

  @Field({ nullable: true })
  createdDate: Date;

  @Field(() => [CartInput], { nullable: true })
  carts: CartInput[];
}
