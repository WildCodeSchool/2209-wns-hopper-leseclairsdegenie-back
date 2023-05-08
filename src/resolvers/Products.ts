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
      .find({ relations: ["category"] });
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
    @Arg("quantityReserved", () => Number, { nullable: true })
    quantityReserved: number,
    @Arg("newPrice", () => Number, { nullable: true }) newPrice: number,
    @Arg("newQuantity", () => Number, { nullable: true }) newQuantity: number
  ): Promise<Product> {
    let product = await datasource
      .getRepository(Product)
      .findOne({ where: { id } });
    let newDisponibility = product.disponibility;
    let quantityUpdate = product.quantity;

    // Mettre à jour la quantité après un arrivage de nouvelle marchandise
    if (newQuantity) {
      if (quantityUpdate) {
        quantityUpdate += newQuantity;
      } else {
        quantityUpdate = newQuantity;
      }
    }

    // mettre à jour les quantité après uen réservation
    if (quantityReserved) {
      if (product.quantity - quantityReserved <= 0) {
        quantityUpdate = 0;
        newDisponibility = false;
      } else {
        quantityUpdate = product.quantity - quantityReserved;
      }
    }

    if (product) {
      return await datasource.getRepository(Product).save({
        ...product,
        quantity: quantityUpdate,
        disponibility: newDisponibility,
        price: newPrice ? newPrice : product.price,
      });
    } else {
      return null;
    }
  }

  @Query(() => [Product])
  async productsRandom(): Promise<Product[]> {
    const listProducts = await datasource
      .getRepository(Product)
      .find({ relations: { category: true } });
    const max = listProducts.length > 5 ? 5 : listProducts.length;

    let listRandom: Product[] = [];

    for (let i = 0; i < max; i++) {
      let j = Math.floor(Math.random() * listProducts.length);
      if (!listRandom?.includes(listProducts[j])) {
        listRandom.push(listProducts[j]);
      } else {
        i--;
      }
    }
    return listRandom;
  }
}
