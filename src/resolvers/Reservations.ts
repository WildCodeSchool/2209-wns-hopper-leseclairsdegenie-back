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
import { Product } from "../entities/Product";
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
      const debut = new Date(data.startDate).getTime();
      const fin = new Date(data.endDate).getTime();
      const nbJour = (fin - debut) / (1000 * 60 * 60 * 24);

      const productReservation = await datasource
        .getRepository(Product)
        .findOne({ where: { id: data.productId } });

      const priceReservation =
        productReservation.price * data.quantity * nbJour;

      const reservationCreated = await datasource
        .getRepository(Reservation)
        .save({
          ...data,
          price: priceReservation,
          nbJours: nbJour,
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

  @Authorized()
  @Mutation(() => Reservation)
  async deleteReservation(
    @Arg("Id", () => ID) id: number,
    @Ctx() context: IContext
  ): Promise<Reservation> {
    let reservation = await datasource
      .getRepository(Reservation)
      .findOne({ where: { id } });

    let cart = await datasource
      .getRepository(Cart)
      .findOne({
        where: { id: context.user.cart.id },
        relations: ["reservations"],
      });

    console.log(cart);

    if (reservation && cart) {
      let allReservations = cart.reservations.map((item) => {
        if (item.id !== id) {
          return item;
        }
      });
      await datasource.getRepository(Cart).save({
        ...cart,
        reservations: allReservations,
      });
      await datasource.getRepository(Reservation).remove(reservation);
      return { ...reservation, id };
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
      const verifyProduct = () => {
        if (currentCart.reservations.length === 0) {
          return false;
        }
        if (currentCart.reservations.length >= 1) {
          console.log("-----------------------");
          const productVerified = currentCart.reservations.filter(
            (reservation) => reservation.product.disponibility === false
          );
          console.log(productVerified);
          if (productVerified.length === 0) {
            return true;
          }
          if (productVerified.length >= 1) {
            return false;
          }
        }
      };
      if (!verifyProduct()) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
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
