import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IContext } from "../auth";
import { Cart } from "../entities/Cart";
import { Order, OrderInput } from "../entities/Order";
import { Reservation } from "../entities/Reservation";
import { User } from "../entities/User";
import datasource from "../utils";

@Resolver()
export class OrdersResolver {
  @Authorized()
  @Mutation(() => Order)
  async createOrder(
    @Ctx() context: IContext
    //@Arg("data", () => OrderInput) data: OrderInput
  ): Promise<Order> {
    console.log(context.user.cart.id);
    let cartToDelete = await datasource.getRepository(Cart).findOne({
      where: { id: context.user.cart.id },
      relations: ["reservations", "reservations.product"],
    });

    console.log("cartToDelete : ", cartToDelete);

    //on crée une commande avec data + les infos du cart contenu dans le context
    //on sauvegarde la commande en DB tout en faisant la liaison avec le user
    const saveOrder = await datasource.getRepository(Order).save({
      billingAdress: cartToDelete.billingAdress,
      billingfirstname: cartToDelete.billingfirstname,
      billingLastname: cartToDelete.billingLastname,
      deliveryAdress: cartToDelete.deliveryAdress,
      deliveryfirstname: cartToDelete.deliveryfirstname,
      deliveryLastname: cartToDelete.deliveryLastname,
      date: new Date(),
      reservations: cartToDelete.reservations,
      statusDelivery: "Expected",
      user: { id: context.user.id },
    });

    //Après payement (donc de création d'une commande) on vide le panier de ses reservations
    if (saveOrder) {
      // La liste des réservation du panier
      const reservationsOfCart = cartToDelete.reservations;

      // On map sur la liste pour passer l'argument cart à null sur chaque réservation
      reservationsOfCart.map(async (reservation) => {
        const updateReservation = await datasource
          .getRepository(Reservation)
          .findOne({
            where: { id: reservation.id },
            relations: ["cart", "order"],
          });

        // On assigne cart à null et on relie la reservation au nouveau order
        if (updateReservation) {
          const reservationUpdated = await datasource
            .getRepository(Reservation)
            .save({
              ...updateReservation,
              cart: null,
              order: { id: saveOrder.id },
            });
        }
      });

      // On modifie la date du lastTimeModified pour le panier
      const cartToUpdate = await datasource
        .getRepository(Cart)
        .save({ ...cartToDelete, lastTimeModified: new Date() });
      console.log(
        "date to delete reservations: ",
        cartToDelete.lastTimeModified
      );

      // On requete la DB pour avoir le résumé de l'order
      const result = await datasource.getRepository(Order).findOne({
        where: { id: saveOrder.id },
        relations: ["user", "reservations", "reservations.product"],
      });
      console.log(result);
      return {
        ...result,
      };
    } else {
      console.log("c'est raté !!!");
      return null;
    }
  }

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return await datasource.getRepository(Order).find({});
  }

  @Query(() => [Order])
  async getOrderForUser(@Ctx() context: IContext): Promise<Order[]> {
    return await datasource.getRepository(Order).find({
      where: { user: { id: context.user.id } },
      relations: ["user", "reservations"],
    });
  }
}
