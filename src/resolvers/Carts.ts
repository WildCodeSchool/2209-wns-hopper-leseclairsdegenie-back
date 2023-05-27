import {
  Resolver,
  Mutation,
  Arg,
  Query,
  ID,
  Authorized,
  Ctx,
  FieldResolver,
} from "type-graphql";
import { Cart } from "../entities/Cart";
import datasource from "../utils";
import { CartInput } from "../entities/Cart";
import { IContext } from "../auth";

@Resolver()
export class CartsResolver {
  @Query(() => [Cart])
  async carts(): Promise<Cart[]> {
    return await datasource
      .getRepository(Cart)
      .find({ relations: ["user", "reservations"] });
  }

  @Query(() => Cart)
  async cart(@Arg("Id", () => ID) id: number): Promise<Cart> {
    return await datasource.getRepository(Cart).findOne({
      where: { id },
      relations: [
        "user",
        "reservations",
        "reservations.product",
        "reservations.cart",
      ],
    });
  }
  @Mutation(()=> Cart)
  async createCart(): Promise<Cart> {
    const cart = datasource.getRepository(Cart).create();
    return await datasource.getRepository(Cart).save(cart);
  }

  @Mutation(() => Cart)
  async deleteCart(@Arg("Id", () => ID) id: number): Promise<Cart> {
    let cart = await datasource.getRepository(Cart).findOne({ where: { id } });
    if (cart) {
      return await datasource.getRepository(Cart).remove(cart);
    } else {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => Cart, { nullable: true })
  async updateCart(
    @Arg("Id", () => ID) id: number,
    @Arg("data", () => CartInput) data: CartInput,
    @Ctx() context: IContext
  ): Promise<Cart | null> {
    const currentCart = context.user.cart;
    let cart = await datasource
      .getRepository(Cart)
      .findOne({ where: { id: currentCart.id } });
    const dataCart: CartInput = {
      billingfirstname: data.billingfirstname,
      billingLastname: data.billingLastname,
      billingAdress: data.billingAdress,
      deliveryfirstname: data.deliveryfirstname,
      deliveryLastname: data.deliveryLastname,
      deliveryAdress: data.deliveryAdress,
      lastTimeModified: new Date(),
    };
    if (cart && Number(currentCart.id) === Number(id)) {
      return await datasource
        .getRepository(Cart)
        .save({ ...currentCart, ...dataCart });
    } else {
      return null;
    }
  }

  @Mutation(() => Cart, { nullable: true })
  async addPriceCart(
    @Arg("price", () => Number) price: number,
    @Ctx() context: IContext
  ): Promise<Cart | null> {
    const currentCart = context.user.cart;
    console.log(currentCart);
    let cart = await datasource
      .getRepository(Cart)
      .findOne({ where: { id: currentCart.id } });
    if (cart) {
      console.log(cart);
      return await datasource
        .getRepository(Cart)
        .save({ ...cart, totalePrice: price });
    } else {
      console.log("null");
      return null;
    }
  }
}
