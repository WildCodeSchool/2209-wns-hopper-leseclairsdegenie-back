import {
  Resolver,
  Mutation,
  Arg,
  Query,
  ID,
  Authorized,
  Ctx,
} from "type-graphql";
import { User, UserInput } from "../entities/User";
import datasource from "../utils";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";
import { IContext } from "../auth";
import { Cart, CartInput } from "../entities/Cart";

@Resolver()
export class UsersResolver {
  @Mutation(() => String, { nullable: true })
  async createUser(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<Object | null> {
    try {
      data.password = await hash(data.password);
      const newUser = await datasource
        .getRepository(User)
        .save({ ...data, createdAt: new Date() });
      if (newUser?.id) {
        const token = sign({ userId: newUser.id }, "supersecret!", {
          expiresIn: 3600,
        });
        if (token) {
          if (data.cartId) {
            const cart = datasource.getRepository(Cart).findOne({
              where: { id: data.cartId }
            });
            await datasource.getRepository(Cart).save({
              ...cart,
              user: { id: newUser.id },
            });
          }
        }

        return token;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  @Mutation(() => String, { nullable: true })
  async signin(
    @Arg("data", () => UserInput) data: UserInput
    // @Arg("email") email: string,
    // @Arg("password") password: string,
    // @Arg("cartId",{ nullable: true }) cartId?: number
  ): Promise<string | null> {
    try {
      const user = await datasource
        .getRepository(User)
        .findOne({ where: { email: data.email } });

      if (!user) {
        return "user not found";
      }

      if (await verify(user.password, data.password)) {
        const token = sign({ userId: user.id }, "supersecret!", {
          expiresIn: 3600,
        });
        if (token) {
          if (data.cartId) {
            const cart = datasource.getRepository(Cart).findOne({
              where: { id: data.cartId }
            });
            await datasource.getRepository(Cart).save({
              ...cart,
              user: { id: user.id },
            });
          }
        }     
        return token;
      } else {
        return "verify problem";
      }
    } catch {
      return "problem";
    }
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: IContext): Promise<User | null> {
    if (!context.user.cart) {
      await datasource
        .getRepository(Cart)
        .save({ user: { id: context.user.id } });
    }
    return context.user;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find({
      relations: [
        "cart",
        "cart.reservations",
        "cart.reservations.product",
        "orders",
        "orders.reservations",
        "orders.reservations.product",
      ],
    });
  }

  @Mutation(() => User)
  async deleteUser(@Arg("Id", () => ID) id: number): Promise<User> {
    let user = await datasource.getRepository(User).findOne({
      where: { id },
    });
    if (user) {
      return await datasource.getRepository(User).remove(user);
    } else {
      return null;
    }
  }

  @Query(() => User)
  async user(@Ctx() context: IContext): Promise<User> {
    console.log(context.user.id);
    return await datasource.getRepository(User).findOne({
      where: { id: context.user.id },
      relations: [
        "cart",
        "cart.reservations",
        "cart.reservations.product",
        "orders",
        "orders.reservations",
        "orders.reservations.product",
      ],
    });
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("Id", () => ID) id: number,
    // @Arg("email") email: string,
    // @Arg("lastname") lastname: string,
    // @Arg("firstname") firstname: string,
    // @Arg("deliveryAdress") deliveryAdress: string,
    // @Arg("createdDate", () => Date) createdDate: Date
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    let user = await datasource.getRepository(User).findOne({ where: { id } });

    if (user) {
      // user.email = data.email;
      // user.lastname = data.lastname;
      // user.firstname = data.firstname;
      // user.deliveryAdress = data.deliveryAdress;
      // user.createdDate = data.createdDate;
      data.password = await hash(data.password);
      return await datasource.getRepository(User).save({ ...user, ...data });
    } else {
      return null;
    }
  }
}
