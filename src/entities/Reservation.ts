import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;
  
  @ManyToOne( () => Product,'reservation', {onDelete: "CASCADE"})
  @Field(() => Product, {nullable: false})
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
<<<<<<< HEAD

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
=======
>>>>>>> 77056cc43ae9fcf3c892c6d7a01eea2d8fb25a52
