import { AuthChecker } from "type-graphql";
import { verify } from "jsonwebtoken";
import datasource from "./utils";
import { User } from "./entities/User";

export interface IContext {
  token: string | null;
  user?: User;
}

export const authChecker: AuthChecker<IContext> = async (
  { root, args, context, info },
  roles
) => {
  const token = context.token;
  if (token === null || token === "") {
    return false;
  }

  try {
    const decodedToken: { userId: number } = verify(
      token,
      "supersecret!"
    ) as any;
    const userId = decodedToken.userId;

    // return true → stateless version!
    const user = await datasource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: ["cart", "cart.reservations", "cart.reservations.product"] });

    // maybe useless?
    if (!user) {
      return false;
    }

    context.user = user;
    return true;
  } catch {
    return false;
  }
};
