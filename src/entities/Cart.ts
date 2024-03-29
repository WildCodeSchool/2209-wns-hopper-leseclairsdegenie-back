import { Field, ID, ObjectType, InputType, Ctx } from "type-graphql";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IContext } from "../auth";
import { Order } from "./Order";
import { Reservation } from "./Reservation";
import { User } from "./User";

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

  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, "cart", { nullable: true })
  reservations: Reservation[];

  @Field(() => Order, { nullable: true })
  @OneToOne(() => Order, "cart", { nullable: true })
  @JoinColumn()
  order: Order;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastTimeModified: Date;

  @Field({ nullable: true })
  totalePrice(@Ctx() context: IContext): number | null {
    const reservations = context.user.cart.reservations;
    let totalePanier = 0;
    reservations.map((resa) => {
      return (totalePanier += resa.price);
    });

    return totalePanier;
  }
}

@InputType()
export class CartInput {
  @Field({ nullable: true })
  billingfirstname: string;

  @Field({ nullable: true })
  billingLastname: string;

  @Field({ nullable: true })
  billingAdress: string;

  @Field({ nullable: true })
  deliveryfirstname: string;

  @Field({ nullable: true })
  deliveryLastname: string;

  @Field({ nullable: true })
  deliveryAdress: string;

  @Field({ nullable: true })
  lastTimeModified: Date;
}
