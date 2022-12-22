import { User } from "./entities/User";
import { DataSource } from "typeorm";
import { Product } from "./entities/Product";
import { Cart } from "./entities/Cart";
import { Reservation } from "./entities/Reservation";

const datasource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "supersecret",
  database: "postgres",
  synchronize: true,
  entities: [User, Product, Cart, Reservation],
  logging: ["query", "error"],
});

export default datasource;
