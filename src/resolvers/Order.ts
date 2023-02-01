import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IContext } from "../auth";
import { Cart } from "../entities/Cart";
import { Order, OrderInput } from "../entities/Order";
import { User } from "../entities/User";
import datasource from "../utils";

@Resolver()
export class OrdersResolver {
  @Mutation(() => Order)
  async createOrder(
    @Ctx() context: IContext,
    @Arg("data", () => OrderInput) data: OrderInput
  ): Promise<Order> {

    const user = await datasource
      .getRepository(User)
      .findOne({ where: { id: data.userId } });
    const order: Partial<Order> = { ...data, user };
    //on crée une commande avec data
    const saveOrder = await datasource.getRepository(Order).save(order);
    // mettre à jour reservations.order (le vider)
   // mettre à jour order.cart (le vider)
    //on supprime le panier
    // if (saveOrder) {
    //   let cartToDelete = await datasource
    //     .getRepository(Cart)
    //     .findOne({ where: { id: user.id } });
    //   const deleteCart = await datasource.getRepository(Cart).clear(cartToDelete);
    // }
    return saveOrder;
  }

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return await datasource
      .getRepository(Order)
      .find({ relations: ["reservations", "cart"] });
  }

  @Query(() => [Order])
  async getOrderForUser(
    @Arg("userId", () => Number) userId: number
  ): Promise<Order[]> {
    return await datasource
      .getRepository(Order)
      .find({ where: { id: userId } });
  }
}
