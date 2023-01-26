import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category, CategoryInput } from "./Category";
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image: string;

  @Column()
  @Field()
  price: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  disponibility: boolean;

  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, "product")
  reservations: Reservation[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, "product", { nullable: true })
  category: Category;
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

  @Field({ nullable: true })
  disponibility: boolean;

  @Field({ nullable: true })
  categoryId: number;
}
