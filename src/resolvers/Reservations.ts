import {
  Resolver,
  Mutation,
  Arg,
  Query,
  ID,
  Ctx,
  Authorized,
} from "type-graphql";
import { getRepository } from "typeorm";
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
    try {
      const reservationCreated = await datasource
        .getRepository(Reservation)
        .save({
          ...data,
          cart: { id: context.user.cart.id },
          product: { id: data.productId },
        });

      if (reservationCreated) {
        const updateDateCart = await datasource
          .getRepository(Cart)
          .findOne({ where: { id: context.user.cart.id } });

        const cartUpdated = await datasource
          .getRepository(Cart)
          .save({ ...updateDateCart, lastTimeModified: new Date() });
        console.log(
          "ajout d'une réservation dans le panier à : ",
          cartUpdated.lastTimeModified
        );
      }
      return await datasource.getRepository(Reservation).findOne({
        where: { id: reservationCreated.id },
        relations: ["product", "cart"],
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => [Reservation])
  async reservations(): Promise<Reservation[]> {
    return await datasource

      .getRepository(Reservation)
      .find({ relations: ["product", "cart", "product.category", "order"] });
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
      .findOne({ where: { id }, relations: ["product", "cart", "order"] });
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

  @Mutation(() => Reservation)
  async updateQuantityReservation(
    @Arg("newQuantity", () => Number) newQuantity: number,
    @Arg("Id", () => ID) id: number
  ): Promise<Reservation> {
    let reservation = await datasource
      .getRepository(Reservation)
      .findOne({ where: { id: id } });

    let reservationUpdated = await datasource
      .getRepository(Reservation)
      .save({ ...reservation, quantity: newQuantity });

    return reservationUpdated;
  }
}
