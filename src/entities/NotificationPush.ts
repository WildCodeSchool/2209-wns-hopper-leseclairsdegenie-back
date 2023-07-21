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
export class NotificationPush {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, "notificationPush", { onDelete: "CASCADE" })
  user: User;

  @Column()
  @Field(() => String)
  token: string;
}


@InputType()
export class DataNotificationInput {
  @Field()
  notificationId: string;

  @Field()
  type: string;

}
