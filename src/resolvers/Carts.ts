import { Resolver, Mutation, Arg, Query, ID } from "type-graphql";
import { Cart } from "../entities/Cart";
import datasource from "../utils";
import { CartInput } from "../entities/Cart";

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

  @Mutation(() => Cart)
  async deleteCart(@Arg("Id", () => ID) id: number): Promise<Cart> {
    let cart = await datasource.getRepository(Cart).findOne({ where: { id } });
    if (cart) {
      return await datasource.getRepository(Cart).remove(cart);
    } else {
      return null;
    }
  }

  @Mutation(() => Cart)
  async updateCart(
    @Arg("Id", () => ID) id: number,
    @Arg("data", () => CartInput) data: CartInput
  ): Promise<Cart> {
    let cart = await datasource.getRepository(Cart).findOne({ where: { id } });

    if (cart) {
      return await datasource.getRepository(Cart).save({ ...cart, ...data });
    } else {
      return null;
    }
  }
}
