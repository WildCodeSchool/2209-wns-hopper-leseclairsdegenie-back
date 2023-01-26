// import { Field, ID, InputType, ObjectType } from "type-graphql";
// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Product } from "./Product";

import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

// @Entity()
// @ObjectType()
// export class Category {
//   @PrimaryGeneratedColumn()
//   @Field(() => ID)
//   id: number;

//   @Column()
//   @Field()
//   name: string;

//   @Field(() => [Product], { nullable: true })
//   @OneToMany(() => Product, "products")
//   products: Product[];
// }

// @InputType()
// export class CategoryInput {
//   @Field()
//   name: string;
// }

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, "category")
  products: Product[];
}
@InputType()
export class CategoryInput {
  @Field()
  name: string;
}
