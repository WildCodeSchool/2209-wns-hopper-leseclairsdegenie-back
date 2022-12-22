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
  @Field({ nullable: true })
  description: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image: string;

  @Column()
  @Field()
  price: number;

  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, "reservations")
  reservations: Reservation[];
}

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field()
  price: number;
}
