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

  @Column()
  @Field()
  billingfirstname: string;

  @Column()
  @Field()
  billingLastname: string;

  @Column()
  @Field()
  billingAdress: string;

  @Column()
  @Field()
  deliveryfirstname: string;

  @Column()
  @Field()
  deliveryLastname: string;

  @Column()
  @Field()
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
  createdAt: Date;
}
