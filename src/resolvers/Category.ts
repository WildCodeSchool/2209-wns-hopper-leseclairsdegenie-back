import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Category, CategoryInput } from "../entities/Category";
import datasource from "../utils";

@Resolver()
export class CategoryResolver {
  @Mutation(() => Category)
  async createCatgory(
    @Arg("data", () => CategoryInput) data: CategoryInput
  ): Promise<Category> {
    return await datasource.getRepository(Category).save(data);
  }

  @Query(() => [Category])
  async getCategorys(): Promise<Category[]> {
    return await datasource
      .getRepository(Category)
      .find({ relations: ["products"] });
  }

  @Query(() => Category)
  async getOneCategory(
    @Arg("categoryName", () => String) categoryName: string
  ): Promise<Category> {
    return await datasource.getRepository(Category).findOne({
      where: { name: categoryName },
      relations: ["products"],
    });
  }
}
