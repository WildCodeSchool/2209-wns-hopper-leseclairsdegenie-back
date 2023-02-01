import { Field, ID, ObjectType, InputType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";
import { Reservation } from "./Reservation";
import { User, UserInput } from "./User";

@Entity()
@ObjectType()
export class Cart {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, "cart", { onDelete: "CASCADE", nullable: true })
  user: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  billingName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  billingAdress: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryAdress: string;

  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, "cart", { nullable: true })
  reservations: Reservation[];

  @Field(() => Order, { nullable: true })
  @OneToOne(() => Order, "cart", { nullable: true })
  order: Order;
}

@InputType()
export class CartInput {
  @Field({ nullable: true })
  billingName: string;

  @Field({ nullable: true })
  billingAdress: string;

  @Field({ nullable: true })
  deliveryName: string;

  @Field({ nullable: true })
  deliveryAdress: string;

  @Field({ nullable: true })
  createdAt: Date;
}
