import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";


@Entity()
@ObjectType()
export class Reservation {
  @ManyToOne( () => Product,'reservation', {onDelete: "CASCADE"})
  @Field(() => Product, {nullable: false})
  product: Product;

  @ManyToOne( () => Cart,'reservation', {onDelete: "CASCADE"})
  @Field(() => Cart, {nullable: false})
  cart: Cart;

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