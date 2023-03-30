import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/Users";
import { authChecker } from "./auth";
import { CartsResolver } from "./resolvers/Carts";
import { ProductsResolver } from "./resolvers/Products";
import { ReservationsResolver } from "./resolvers/Reservations";
import { CategoryResolver } from "./resolvers/Category";
import { OrdersResolver } from "./resolvers/Order";
import { Dev } from "./resolvers/Dev";

// just a test to triger CI
const PORT = 5000;

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      CartsResolver,
      ProductsResolver,
      ReservationsResolver,
      CategoryResolver,
      OrdersResolver,
      Dev,
    ],
    validate: {
      forbidUnknownValues: false,
    },
    authChecker,
  });

  // Create the GraphQL server and verify authorizarion
  const server = new ApolloServer({
    schema,
    cors: true,
    context: ({ req }) => {
      // Get the user token from the headers.
      const authorization: string = req?.headers?.authorization;

      if (authorization) {
        // Bearer ...jwt
        const token = authorization.split(" ").pop();
        return { token };
      }
      // Add the user to the context
      return { token: null };
    },
  });

  try {
    await datasource.initialize();
    console.log("Server started!");
    // Start the server
    const { url } = await server.listen(PORT);
    console.log(
      `Server is running, GraphQL Playground available at ${url} !!!`
    );
  } catch (err) {
    console.log("An error occured");
    console.error(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
