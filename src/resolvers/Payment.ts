import {Arg, Authorized, Ctx, Field, ID, InputType, Query, Resolver} from "type-graphql";
import {Product} from "../entities/Product";
import datasource from "../utils";
import stripePayment from "../stripeFunctions"
import {IContext} from "../auth";

export interface IPayment {
    clientSecret: string,
}

@InputType()
export class PaymentInput {
    @Field()
    clientSecret: string;
}

@Resolver()
export class PaymentResolver {
    @Authorized()
    @Query(() => String)
    async confirmPayment(@Ctx() context: IContext): Promise<String> {
        const reservations = context.user.cart.reservations;
        let totalePanier = 0;
        reservations.map((resa) => {
            return (totalePanier += resa.price);
        });

        const amount = totalePanier;
        const description = `Payement pour la commande WR-${context.user.orders.length} du user ${context.user.id}`
        console.log("amount = ", amount);
        const result = stripePayment(amount, description)

        return result
    }
}

