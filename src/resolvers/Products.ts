import { Resolver, Mutation, Arg, Query, ID } from "type-graphql";
import { Product, ProductInput } from "../entities/Product";
import datasource from "../utils";
import { hash } from "argon2";

@Resolver()
export class ProductsResolver {
  @Mutation(() => Product)
  async createProduct(
    @Arg("data", () => ProductInput) data: ProductInput
  ): Promise<Product> {
    return await datasource.getRepository(Product).save(data);
  }

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return await datasource.getRepository(Product).find({});
  }

  @Mutation(() => Product)
  async deleteProduct(@Arg("Id", () => ID) id: number): Promise<Product> {
    let product = await datasource
      .getRepository(Product)
      .findOne({ where: { id } });
    if (product) {
      return await datasource.getRepository(Product).remove(product);
    } else {
      return null;
    }
  }

  @Query(() => Product)
  async product(@Arg("Id", () => ID) id: number): Promise<Product> {
    return await datasource.getRepository(Product).findOne({ where: { id } });
  }

  @Mutation(() => Product)
  async updeateProduct(
    @Arg("Id", () => ID) id: number,
    @Arg("data", () => ProductInput) data: ProductInput
  ): Promise<Product> {
    let product = await datasource
      .getRepository(Product)
      .findOne({ where: { id } });

    if (product) {
      return await datasource
        .getRepository(Product)
        .save({ ...product, ...data });
    } else {
      return null;
    }
  }
}
