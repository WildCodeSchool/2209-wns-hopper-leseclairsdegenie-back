import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Order, OrderInput } from "../entities/Order";
import { User } from "../entities/User";
import datasource from "../utils";

@Resolver()
export class OrdersResolver {
  @Mutation(() => Order)
  async createOrder(
    @Arg("data", () => OrderInput) data: OrderInput
  ): Promise<Order> {
    const user = await datasource
      .getRepository(User)
      .findOne({ where: { id: data.userId } });
    const order: Partial<Order> = { ...data, user };
    return await datasource.getRepository(Order).save(order);
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
