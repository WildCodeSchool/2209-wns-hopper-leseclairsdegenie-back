import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image: string;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, "category")
  products: Product[];
}
@InputType()
export class CategoryInput {
  @Field()
  name: string;
  
  @Field({ nullable: true })
  image: string;
}
