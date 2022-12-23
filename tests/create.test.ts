import { beforeAll, describe, it } from "@jest/globals";
import { graphql, GraphQLSchema, print } from "graphql";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "../src/resolvers/Users";
import datasource from "../src/utils";
import { createUser } from "./graphql/createUser";

let schema: GraphQLSchema;

beforeAll(async () => {
  // connect to DB
  await datasource.initialize();

  // purge DB
  try {
    const entities = datasource.entityMetadatas;
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(", ");
    await datasource.query(`TRUNCATE ${tableNames} CASCADE;`);
    console.log("[TEST DATABASE]: Clean");
  } catch (error) {
    throw new Error(`ERROR: Cleaning test database: ${JSON.stringify(error)}`);
  }

  // compute GraphQL schema
  schema = await buildSchema({
    resolvers: [UsersResolver],
  });
});

describe("users", () => {
    describe("user signup", () => {
        it("creates a new user", async () => {
            // check here   
            const result = await graphql({
              schema,
              source: print(createUser),
              variableValues: {
                data: {
                  email: "toto@test.com",
                  password: "supersecret",
                },
              },
            });
        }
        )
    })
})