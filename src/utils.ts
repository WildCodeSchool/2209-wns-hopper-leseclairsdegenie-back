import { User } from "./entities/User";
import { Cart } from "./entities/Cart";
import { DataSource } from "typeorm";
import { Reservation } from "./entities/Reservation";
import { Product } from "./entities/Product";

const datasource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "supersecret",
  database: "postgres",
  synchronize: true,
  entities: [User, Cart, Reservation, Product],
  logging: ["query", "error"],
});

export default datasource;
