import { Resolver, Mutation, Arg, Query, ID } from "type-graphql";
import { Product, ProductInput } from "../entities/Product";
import datasource from "../utils";
import { hash } from "argon2";
import { Category } from "../entities/Category";

@Resolver()
export class ProductsResolver {
  @Mutation(() => Product)
  async createProduct(
    @Arg("data", () => ProductInput) data: ProductInput
  ): Promise<Product> {
    console.log(data);
    const category = await datasource.getRepository(Category).findOneBy({
      id: data.categoryId,
    });
    if (category.id != null) {
      console.log(category);
      const product = {
        ...data,
        category: category,
      };
      return await datasource.getRepository(Product).save(product);
    }
  }

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return await datasource
      .getRepository(Product)
      .find({ relations: { category: true } });
  }

  @Mutation(() => Product)
  async deleteProduct(@Arg("Id", () => ID) id: number): Promise<Product> {
    let product = await datasource
      .getRepository(Product)
      .findOne({ where: { id }, relations: { category: true } });
    if (product) {
      await datasource.getRepository(Product).remove(product);
      return product;
    } else {
      return null;
    }
  }

  @Query(() => Product)
  async product(@Arg("Id", () => ID) id: number): Promise<Product> {
    return await datasource
      .getRepository(Product)
      .findOne({ where: { id }, relations: { category: true } });
  }

  @Mutation(() => Product)
  async updateProduct(
    @Arg("Id", () => ID) id: number,
    @Arg("newQuantity", () => Number) newQuantity: number
  ): Promise<Product> {
    let product = await datasource
      .getRepository(Product)
      .findOne({ where: { id } });

    let newDisponibility = product.disponibility;
    if (product.quantity - newQuantity === 0) {
      newDisponibility = false;
    }

    if (product) {
      return await datasource.getRepository(Product).save({
        ...product,
        quantity: newQuantity,
        disponibility: newDisponibility,
      });
    } else {
      return null;
    }
  }
}
