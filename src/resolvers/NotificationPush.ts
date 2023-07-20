import { Resolver, Mutation, Arg, Ctx, Authorized, ID } from "type-graphql";
import datasource from "../utils";
import { IContext } from "../auth";
import {
  DataNotificationInput,
  NotificationPush,
} from "../entities/NotificationPush";
import { In } from "typeorm";
import { User } from "../entities/User";
import axios from "axios";

@Resolver()
export class NotificationPushResolver {
  @Mutation(() => String, { nullable: true })
  async saveTokenNotificationPush(
    @Arg("token") token: string,
    @Arg("userId", () => ID, { nullable: true }) userId: number
  ): Promise<string | null> {
    console.log("Hello");
    try {
      const tokenIsInBdd = await datasource
        .getRepository(NotificationPush)
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
              await datasource.getRepository(NotificationPush).save({
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
              .getRepository(NotificationPush)
              .save({ user: { id: user.id }, token: token });
            return "token saved";
          }
        } else {
          await datasource
            .getRepository(NotificationPush)
            .save({ ...tokenIsInBdd, user: { id: null } });
          return "no user found most create a account";
        }
      } else {
        await datasource
          .getRepository(NotificationPush)
          .save({ ...tokenIsInBdd, user: { id: null } });
        return "user disconnected on display";
      }
    } catch {
      return "problem saveNotificationPush";
    }
  }

  @Mutation(() => Boolean)
  async sendNotificationPush(
    @Arg("title") title: string,
    @Arg("body") body: string,
    @Arg("data", () => DataNotificationInput) data: DataNotificationInput,
    @Arg("expoPushToken") expoPushToken: string
  ): Promise<boolean> {
    console.log("Here");
    try {
      const findDivise = await datasource
        .getRepository(NotificationPush)
        .findOne({ where: { token: expoPushToken }, relations: ["user"] });

      if (findDivise) {
        const message = {
          to: findDivise.token,
          sound: "default",
          title,
          body,
          data,
        };

        const reponse = await axios("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          data: JSON.stringify(message),
        });
        if (reponse) {
          console.log("sended");
          return true;
        }
      }
    } catch {
      console.log("error on send");
      return false;
    }
  }
}
