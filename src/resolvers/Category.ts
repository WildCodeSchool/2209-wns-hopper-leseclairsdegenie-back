import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Category, CategoryInput } from "../entities/Category";
import datasource from "../utils";

@Resolver()
export class CategoryResolver {
  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CategoryInput) data: CategoryInput
  ): Promise<Category> {
    return await datasource.getRepository(Category).save(data);
  }

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await datasource
      .getRepository(Category)
      .find({ relations: {"products": true} });
  }

  @Query(() => Category)
  async category(@Arg("Id", () => ID) id: number): Promise<Category> {
    return await datasource.getRepository(Category).findOne({
      where: { id: id },
      relations: {"products": true},
    });
  }
}
