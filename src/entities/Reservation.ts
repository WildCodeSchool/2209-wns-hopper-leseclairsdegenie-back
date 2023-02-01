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
  @Field(() => Cart, { nullable: false })
  cart: Cart;

  @ManyToOne(() => Order, "reservation")
  @Field(() => Order)
  order: Order;

  @Column()
  @Field()
  startDate: Date;

  @Column()
  @Field()
  endDate: Date;

  @Column()
  @Field()
  quantity: number;

  @Column()
  @Field()
  price: number;

  @Column()
  @Field()
  taxes: number;
}

@InputType()
export class ReservationInput {
  @Field(() => ID)
  productId: number;

  @Field(() => ID)
  cartId: number;

  @Column()
  @Field()
  startDate: Date;

  @Column()
  @Field()
  endDate: Date;

  @Column()
  @Field()
  quantity: number;

  @Column()
  @Field()
  price: number;

  @Column()
  @Field()
  taxes: number;
}
