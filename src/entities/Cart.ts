import { Field, ID, ObjectType, InputType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reservation } from "./Reservation";
import { User, UserInput } from "./User";

@Entity()
@ObjectType()
export class Cart {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => User)
  @OneToOne(() => User, "cart", { onDelete: "CASCADE" })
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
}

@InputType()
export class CartInput {
  @Field(() => ID)
  userId: number;

  @Field({ nullable: true })
  lastTimeModified: Date;
}
