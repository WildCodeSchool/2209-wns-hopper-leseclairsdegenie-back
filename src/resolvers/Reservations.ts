import { Resolver, Mutation, Arg, Query, ID } from "type-graphql";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { Reservation, ReservationInput } from "../entities/Reservation";
import datasource from "../utils";

@Resolver()
export class ReservationsResolver {
  @Mutation(() => Reservation)
  async createReservation(
    @Arg("data", () => ReservationInput) data: ReservationInput
  ): Promise<Reservation> {
    console.log(data);
    const cart = await datasource
      .getRepository(Cart)
      .findOne({ where: { id: data.cartId } });
    const product = await datasource
      .getRepository(Product)
      .findOne({ where: { id: data.productId } });
    const order = await datasource
      .getRepository(Order)
      .findOne({ where: { id: data.orderId } });
    const reservation: Partial<Reservation> = { ...data, cart, product, order };
    return await datasource.getRepository(Reservation).save(reservation);
  }

  @Query(() => [Reservation])
  async reservations(): Promise<Reservation[]> {
    return await datasource
      .getRepository(Reservation)
      .find({ relations: ["product", "cart"] });
  }

  @Mutation(() => Reservation)
  async deleteReservation(
    @Arg("Id", () => ID) id: number
  ): Promise<Reservation> {
    let reservation = await datasource
      .getRepository(Reservation)
      .findOne({ where: { id } });
    if (reservation) {
      return await datasource.getRepository(Reservation).remove(reservation);
    } else {
      return null;
    }
  }

  @Query(() => Reservation)
  async reservation(@Arg("Id", () => ID) id: number): Promise<Reservation> {
    return await datasource
      .getRepository(Reservation)
      .findOne({ where: { id }, relations: ["product", "cart"] });
  }

  @Mutation(() => Reservation)
  async updateReservation(
    @Arg("Id", () => ID) id: number,
    @Arg("data", () => ReservationInput) data: ReservationInput
  ): Promise<Reservation> {
    let reservation = await datasource
      .getRepository(Reservation)
      .findOne({ where: { id } });

    if (reservation) {
      return await datasource
        .getRepository(Reservation)
        .save({ ...reservation, ...data });
    } else {
      return null;
    }
  }
}
