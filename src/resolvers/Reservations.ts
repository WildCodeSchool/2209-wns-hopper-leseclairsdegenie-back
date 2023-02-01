import { Resolver, Mutation, Arg, Query, ID, Ctx } from "type-graphql";
import { IContext } from "../auth";
import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { Reservation, ReservationInput } from "../entities/Reservation";
import datasource from "../utils";

@Resolver()
export class ReservationsResolver {
  @Mutation(() => Reservation)
  async createReservation(
    @Arg("data", () => ReservationInput) data: ReservationInput,
    @Ctx() context: IContext
  ): Promise<Reservation> {
    return await datasource.getRepository(Reservation).save({
      ...data,
      cart: { id: context.user.cart.id },
      product: { id: data.productId },
    });
  }

  @Query(() => [Reservation])
  async reservations(): Promise<Reservation[]> {
    return await datasource

      .getRepository(Reservation)
      .find({ relations: ["product", "cart", "product.category"] });
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
