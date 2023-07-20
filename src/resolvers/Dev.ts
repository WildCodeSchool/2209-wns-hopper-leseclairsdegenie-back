import { Mutation, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import datasource from "../utils";
import { User, UserInput } from "../entities/User";
import { Cart, CartInput } from "../entities/Cart";
import axios from "axios";
import { NotificationPush } from "../entities/NotificationPush";
import { Any } from "typeorm";

@Resolver()
export class Dev {
  @Mutation(() => Boolean)
  async reset(): Promise<boolean> {
    // purge DB
    try {
      const entities = datasource.entityMetadatas;
      const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(", ");
      await datasource.query(`TRUNCATE ${tableNames} CASCADE;`);
      console.log("[TEST DATABASE]: Clean");
    } catch (error) {
      throw new Error(
        `ERROR: Cleaning test database: ${JSON.stringify(error)}`
      );
    }
    // could populate
    const categories = [
      {
        name: "Cycles",
        image:
          "https://tuvalum.fr/blog/wp-content/uploads/2022/01/Blog-900x600-4-1.jpg",
      },
      {
        name: "Montagne",
        image:
          "https://media.istockphoto.com/id/1257851030/fr/photo/les-coureurs-de-sentier-montent-la-cr%C3%AAte-de-haute-montagne.jpg?s=612x612&w=0&k=20&c=7i69LHXO0feF5YG-F1WCUYjz4k9TOXfjye4zuHAMk7c=",
      },
      {
        name: "Sports aquatiques",
        image:
          "https://lepetitplongeur.fr/wp-content/uploads/2020/10/faire-du-canoe-en-mer-a-plusieurs.jpg",
      },
      {
        name: "Sports d'hiver",
        image:
          "https://media.routard.com/image/20/2/snowboard.1604202.w430.jpg",
      },
      {
        name: "Camping",
        image:
          "https://www.campings.com/fr/content/wp-content/uploads/2020/02/quels-sont-les-types-d-hebergements-en-camping-1.jpg",
      },
    ];
    for (let i = 0; i < categories.length; i++) {
      const category = await datasource
        .getRepository(Category)
        .findOne({ where: { name: categories[i].name } });
      if (category === null) {
        await datasource
          .getRepository(Category)
          .save({ name: categories[i].name, image: categories[i].image });
      }
    }
    const cyclesCategory = datasource
      .getRepository(Category)
      .findOne({ where: { name: "Cycles" } });
    console.log("ICI", (await cyclesCategory).id);
    const mountainCategory = datasource
      .getRepository(Category)
      .findOne({ where: { name: "Montagne" } });
    const aquaCategory = datasource
      .getRepository(Category)
      .findOne({ where: { name: "Sports aquatiques" } });
    const winterCategory = datasource
      .getRepository(Category)
      .findOne({ where: { name: "Sports d'hiver" } });
    const campCategory = datasource
      .getRepository(Category)
      .findOne({ where: { name: "Camping" } });
    const products = [
      {
        category: await cyclesCategory,
        name: "VTT électrique",
        description:
          "Partez à l'aventure où vous le souhaitez avec ce vtt électrique",
        disponibility: true,
        quantity: 50,
        image:
          "https://cdn.pixabay.com/photo/2020/09/13/09/50/mountain-bike-5567847_960_720.jpg",
        price: 35.0,
      },
      {
        category: await mountainCategory,
        name: "Sac à dos trekking 50L",
        description:
          "Partez à l'aventure où vous le souhaitez avec ce sac à dos de randonnée",
        disponibility: true,
        quantity: 50,
        image:
          "https://images.pexels.com/photos/1178525/pexels-photo-1178525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        price: 10.0,
      },
      {
        category: await aquaCategory,
        name: "Masque de plongée",
        description:
          "Partez à l'aventure où vous le souhaitez avec ce masque de plongée",
        disponibility: true,
        quantity: 50,
        image:
          "https://media.istockphoto.com/id/1059596206/fr/photo/tuba.jpg?b=1&s=612x612&w=0&k=20&c=8dH33EdbbPe1pOPOB4Iy6vqmih6xDXUxvvNP9h3UViY=",
        price: 7.0,
      },
      {
        category: await winterCategory,
        name: "Snowboard",
        description:
          "Partez à l'aventure où vous le souhaitez avec ce snowboard",
        disponibility: true,
        quantity: 50,
        image:
          "https://images.pexels.com/photos/1903935/pexels-photo-1903935.jpeg?auto=compress&cs=tinysrgb&w=600",
        price: 25.0,
      },
      {
        category: await campCategory,
        name: "Tente 2 pers",
        description:
          "Partez à l'aventure où vous le souhaitez avec cette tente pour 2 personnes",
        disponibility: true,
        quantity: 50,
        image:
          "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&w=600",
        price: 15.0,
      },
      {
        category: await aquaCategory,
        name: "Paddle",
        description: "Partez à l'aventure où vous le souhaitez avec ce paddle",
        disponibility: true,
        quantity: 50,
        image:
          "https://images.pexels.com/photos/1751550/pexels-photo-1751550.jpeg?auto=compress&cs=tinysrgb&w=600",
        price: 40.0,
      },
      {
        category: await mountainCategory,
        name: "Baudrier",
        description:
          "Partez à l'aventure où vous le souhaitez avec ce baudrier",
        disponibility: true,
        quantity: 50,
        image:
          "https://cdn.pixabay.com/photo/2015/09/09/09/02/forest-climbing-park-931256__480.jpg",
        price: 12.0,
      },
      {
        category: await winterCategory,
        name: "Paire de skis",
        description:
          "Partez à l'aventure où vous le souhaitez avec cette paire de ski",
        disponibility: true,
        quantity: 50,
        image:
          "https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473__480.jpg",
        price: 25.0,
      },
    ];
    for (let i = 0; i < products.length; i++) {
      const product = await datasource
        .getRepository(Product)
        .findOne({ where: { name: products[i].name } });
      if (product === null) {
        await datasource.getRepository(Product).save(products[i]);
      }
    }
    // userTest password = 12345678
    const userTest: User = {
      id: 1,
      email: "test@test.com",
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$u5eMoJNkSJLWMcIaGaSaLw$RtJWicY3QndDyl/FGvI1Q4ghPuUd9FY2kQbquRI5PVY",
      firstname: "Test",
      lastname: "TEST",
      deliveryAdress: "100 rue du Test, TEST 69778",
      createdAt: new Date(),
      cart: null,
      orders: null,
    };
    const newUser = await datasource
      .getRepository(User)
      .save({ ...userTest, createdAt: new Date() });
    if (newUser?.id) {
      const dataCart: CartInput = {
        billingfirstname: userTest.firstname,
        billingLastname: userTest.lastname,
        billingAdress: userTest.deliveryAdress,
        deliveryfirstname: userTest.firstname,
        deliveryLastname: userTest.lastname,
        deliveryAdress: userTest.deliveryAdress,
        lastTimeModified: new Date(),
      };
      await datasource.getRepository(Cart).save({
        ...dataCart,
        user: { id: newUser.id },
      });
    }

    //...
    return true;
  }

  @Mutation(() => Boolean)
  async sendNotificationTestAllUsers(): Promise<boolean> {
    // send push notifications
    // const users = await datasource.getRepository(User).find();
    // const pushTokens = users.map(user => user.pushToken);
    const reponses = [];
    const pushTokens = await datasource
      .getRepository(NotificationPush)
      .find({ relations: ["user"] });
    for (const token in pushTokens) {
      if (pushTokens[token].user) {
        console.log(pushTokens[token]);
        const message = {
          to: pushTokens[token].token,
          sound: "default",
          title: "New post!",
          body: "Ovrez l'app, il y a du nouveaux",
          data: { notificationId: "1234", type: "newProduct" },
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
          reponses.push(reponse);
        }
      }
    }
    console.log(reponses);
    return true;
  }
}
