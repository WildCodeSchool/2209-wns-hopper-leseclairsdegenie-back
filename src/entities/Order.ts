import { Field, ID, ObjectType, InputType } from "type-graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Reservation } from "./Reservation";
import { User } from "./User";

@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, "order", { onDelete: "CASCADE" })
  user: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  billingfirstname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  billingLastname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  billingAdress: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryfirstname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryLastname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryAdress: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  totalPrice: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  statusDelivery: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  date: Date;

  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, "order", { nullable: true, cascade: true })
  reservations: Reservation[];
}

@InputType()
export class OrderInput {
  @Field()
  cartId: number;

  // @Field({ nullable: true })
  // deliveryfirstname: string;

  // @Field({ nullable: true })
  // deliveryLastname: string;

  // @Field({ nullable: true })
  // deliveryAdress: string;

  // @Field({ nullable: true })
  // totalPrice: number;

  // @Field({ nullable: true })
  // taxes: number;

  // @Field({ nullable: true })
  // date: Date;

  // @Field({ nullable: true })
  // statusDelivery: string;
}
