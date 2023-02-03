import {
  Resolver,
  Mutation,
  Arg,
  Query,
  ID,
  Ctx,
  Authorized,
} from "type-graphql";
import { IContext } from "../auth";
import { Cart } from "../entities/Cart";
import { Reservation, ReservationInput } from "../entities/Reservation";
import datasource from "../utils";

@Resolver()
export class ReservationsResolver {
  @Authorized()
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
  @Authorized()
  @Mutation(() => Boolean)
  async verifyReservationsList(
    @Arg("Id", () => ID) id: number,
    @Ctx() context: IContext
  ): Promise<boolean> {
    const currentCart = context.user.cart;
    let cart = await datasource.getRepository(Cart).findOne({
      where: { id: currentCart.id },
    });
    if (
      cart &&
      Number(currentCart.id) === Number(id) &&
      Number(id) === Number(cart.id)
    ) {
      console.log(currentCart);
      const productNotAvailable = currentCart.reservations.find(
        (reservation) => reservation.product.disponibility === false
      );
      console.log(productNotAvailable);
      if (productNotAvailable) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
