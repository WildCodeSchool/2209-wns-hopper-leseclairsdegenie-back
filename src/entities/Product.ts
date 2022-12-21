import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./Reservation";

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  image: string;

  @Column()
  @Field()
  price: number;

  @Field(() => [Reservation])
  @OneToMany(() => Reservation, "reservations")
  reservations: Reservation[];
}

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  image: string;

  @Field()
  price: number;
}
