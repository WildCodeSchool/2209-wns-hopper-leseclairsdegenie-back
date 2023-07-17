import { Resolver, Mutation, Arg, Ctx, Authorized, ID } from "type-graphql";
import datasource from "../utils";
import { IContext } from "../auth";
import { TokenNotificationPush } from "../entities/TokenNotificationPush";
import { In } from "typeorm";
import { User } from "../entities/User";

@Resolver()
export class TokenNotificationPushListResolver {
  @Mutation(() => String, { nullable: true })
  async saveTokenNotificationPush(
    @Arg("token") token: string,
    @Arg("userId", () => ID, { nullable: true }) userId: number
  ): Promise<string | null> {
    try {
      const tokenIsInBdd = await datasource
        .getRepository(TokenNotificationPush)
        .findOne({
          where: { token: token },
          relations: ["user"],
        });

      if (userId) {
        const user = await datasource.getRepository(User).findOne({
          where: { id: userId },
        });
        if (user) {
          if (tokenIsInBdd) {
            if (
              (tokenIsInBdd.user?.id && tokenIsInBdd.user.id !== user.id) ||
              !tokenIsInBdd.user?.id
            ) {
              await datasource.getRepository(TokenNotificationPush).save({
                id: tokenIsInBdd.id,
                token: tokenIsInBdd.token,
                user: { id: user.id },
              });
              return "user of token has been updated for this token";
            } else {
              return "token no changed";
            }
          }
          if (!tokenIsInBdd) {
            await datasource
              .getRepository(TokenNotificationPush)
              .save({ user: { id: user.id }, token: token });
            return "token saved";
          }
        } else {
          await datasource
            .getRepository(TokenNotificationPush)
            .save({ ...tokenIsInBdd, user: { id: null } });
          return "no user found most create a account";
        }
      } else {
        await datasource
          .getRepository(TokenNotificationPush)
          .save({ ...tokenIsInBdd, user: { id: null } });
        return "user disconnected on display";
      }
    } catch {
      return "problem saveTokenNotificationPush";
    }
  }
}
