import { Resolver, Mutation, Arg, Query, ID } from "type-graphql";
import { Cart } from "../entities/Cart";
import { User } from "../entities/User";
import datasource from "../utils";

@Resolver()
export class CartsResolver {
  @Mutation(() => Cart)
  async creatCart(@Arg("data", () => Cart) data: Cart): Promise<Cart> {
    return await datasource.getRepository(Cart).save(data);
  }

  @Query(() => [Cart])
  async carts(): Promise<Cart[]> {
    return await datasource.getRepository(Cart).find({});
  }

  @Mutation(() => Cart)
  async deleteUser(@Arg("Id", () => ID) id: number): Promise<Cart> {
    let cart = await datasource.getRepository(Cart).findOne({ where: { id } });
    if (cart) {
      return await datasource.getRepository(Cart).remove(cart);
    } else {
      return null;
    }
  }

  @Query(() => Cart)
  async user(@Arg("Id", () => ID) id: number): Promise<Cart> {
    return await datasource.getRepository(Cart).findOne({ where: { id } });
  }

  @Mutation(() => Cart)
  async updeateUser(
    @Arg("Id", () => ID) id: number,
    // @Arg("email") email: string,
    // @Arg("lastname") lastname: string,
    // @Arg("firstname") firstname: string,
    // @Arg("deliveryAdress") deliveryAdress: string,
    // @Arg("createdDate", () => Date) createdDate: Date
    @Arg("data", () => Cart) data: Cart
  ): Promise<Cart> {
    let cart = await datasource.getRepository(Cart).findOne({ where: { id } });

    if (cart) {
      // user.email = data.email;
      // user.lastname = data.lastname;
      // user.firstname = data.firstname;
      // user.deliveryAdress = data.deliveryAdress;
      // user.createdDate = data.createdDate;
      return await datasource.getRepository(Cart).save({ ...cart, ...data });
    } else {
      return null;
    }
  }
}
