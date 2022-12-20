import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./Reservation";
import { User } from "./User";


@Entity()
@ObjectType()
export class Cart {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @ManyToOne( () => User,'carts', {onDelete: "CASCADE"})
  @Field(() => User, {nullable: false})
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
  @OneToMany(() => Reservation, 'reservations')
  reservations: Reservation[];
}