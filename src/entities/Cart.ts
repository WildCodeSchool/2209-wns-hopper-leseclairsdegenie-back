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

  @ManyToOne(() => User, "cart", { onDelete: "CASCADE" })
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  billingName: string;

  @Column()
  @Field()
  billingAdress: string;

  @Column()
  @Field()
  deliveryName: string;

  @Column()
  @Field()
  deliveryAdress: string;

  @Column()
  @Field()
  totalPrice: number;

  @Column()
  @Field()
  taxes: number;

  @Column()
  @Field()
  flgValidated: boolean;

  @Column()
  @Field()
  createdDate: Date;

  @Field(() => [Reservation])
  @OneToMany(() => Reservation, "reservations")
  reservations: Reservation[];
}

@InputType()
export class CartInput {
  @Field(() => UserInput)
  user: UserInput;

  @Field()
  billingName: string;

  @Field()
  billingAdress: string;

  @Field()
  deliveryName: string;

  @Field()
  deliveryAdress: string;

  @Field()
  totalPrice: number;

  @Field()
  taxes: number;

  @Field()
  flgValidated: boolean;

  @Field()
  createdDate: Date;
}
