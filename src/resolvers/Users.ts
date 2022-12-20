import { Resolver, Mutation, Arg, Query, ID } from "type-graphql";
import { User, UserInput } from "../entities/User";
import datasource from "../utils";
import { hash } from "argon2";

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    return await datasource.getRepository(User).save(data);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find({});
  }

  @Mutation(() => User)
  async deleteUser(@Arg("Id", () => ID) id: number): Promise<User> {
    let user = await datasource.getRepository(User).findOne({ where: { id } });
    if (user) {
      return await datasource.getRepository(User).remove(user);
    } else {
      return null;
    }
  }

  @Query(() => User)
  async user(@Arg("Id", () => ID) id: number): Promise<User> {
    return await datasource.getRepository(User).findOne({ where: { id } });
  }

  @Mutation(() => User)
  async updeateUser(
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
