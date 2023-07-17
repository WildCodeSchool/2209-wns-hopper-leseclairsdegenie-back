import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class TokenNotificationPush {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, "tokenNotificationPushList", { onDelete: "CASCADE" })
  user: User;

  @Column()
  @Field(() => String)
  token: string;
}
