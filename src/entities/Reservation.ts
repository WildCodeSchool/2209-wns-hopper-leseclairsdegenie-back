import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
@ObjectType()
export class Reservation {
  @ManyToOne(() => Product, "reservation", { onDelete: "CASCADE" })
  @Field(() => Product, { nullable: false })
  product: Product;

  @ManyToOne(() => Cart, "reservation", { onDelete: "CASCADE" })
  @Field(() => Cart, { nullable: false })
  cart: Cart;

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

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
}
