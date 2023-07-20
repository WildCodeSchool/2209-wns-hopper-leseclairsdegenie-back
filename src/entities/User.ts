import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { Cart } from "./Cart";
import { Order } from "./Order";

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
  createdAt: Date;

  @Field(() => Cart, { nullable: true })
  @OneToOne(() => Cart, "user", { nullable: true })
  @JoinColumn()
  cart: Cart;

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, "user", { nullable: true })
  orders: Order[];
}

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 60)
  password: string;

  @Field({ nullable: true })
  firstname: string;

  @Field({ nullable: true })
  lastname: string;

  @Field({ nullable: true })
  deliveryAdress: string;

  @Field(() => ID, {nullable: true})
  cartId: number;
}
