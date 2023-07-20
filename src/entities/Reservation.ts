import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne(() => Product, "reservation", { onDelete: "CASCADE" })
  @Field(() => Product, { nullable: false })
  product: Product;

  @ManyToOne(() => Cart, "reservation", { onDelete: "CASCADE" })
  @Field(() => Cart, { nullable: true })
  cart: Cart;

  @ManyToOne(() => Order, "reservation", { nullable: true })
  @Field(() => Order, { nullable: true })
  order: Order;

  @Column({ nullable: true })
  @Field({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  price: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  taxes: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  nbJours: number;
}

@InputType()
export class ReservationInput {
  @Field(() => ID)
  productId: number;

  @Field(() => ID, { nullable: true })
  cartId: number;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
}
