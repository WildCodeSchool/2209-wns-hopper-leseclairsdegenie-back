import { Field, ID, ObjectType, InputType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, "carts", { onDelete: "CASCADE" })
  user: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  billingName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  billingAdress: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deliveryAdress: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  totalPrice: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  taxes: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  flgValidated: boolean;

  @Column()
  @Field({ nullable: true })
  createdDate: Date;

  @Field(() => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, "reservations", { nullable: true })
  reservations: Reservation[];
}

@InputType()
export class CartInput {
  @Field(() => ID)
  userId: number;

  @Field({ nullable: true })
  billingName: string;

  @Field({ nullable: true })
  billingAdress: string;

  @Field({ nullable: true })
  deliveryName: string;

  @Field({ nullable: true })
  deliveryAdress: string;

  @Field({ nullable: true })
  totalPrice: number;

  @Field({ nullable: true })
  taxes: number;

  @Field({ nullable: true })
  flgValidated: boolean;

  @Field({ nullable: true })
  createdDate: Date;
}
