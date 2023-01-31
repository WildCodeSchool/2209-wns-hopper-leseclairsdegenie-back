import { User } from "./entities/User";
import { Cart } from "./entities/Cart";
import { DataSource } from "typeorm";
import { Reservation } from "./entities/Reservation";
import { Product } from "./entities/Product";
import { Category } from "./entities/Category";
import { Order } from "./entities/Order";

const datasource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: "postgres",
  password: "supersecret",
  database: "postgres",
  synchronize: true,
  entities: [User, Cart, Reservation, Product, Category, Order],
  logging: ["query", "error"],
});

export default datasource;
