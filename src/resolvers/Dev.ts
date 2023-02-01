import { Mutation, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import datasource from "../utils";

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
    const categories = ["Cycles", "Montagne", "Sports aquatiques", "Sports d'hiver", "Camping"];
    for (let i = 0; i < categories.length; i++) {
        const category = await datasource
        .getRepository(Category)
        .findOne({ where: { name: categories[i] } });
      if (category === null) {
        await datasource.getRepository(Category).save({ name: categories[i] });
      }
    }
    const cyclesCategory = datasource.getRepository(Category).findOne({ where: { name: "Cycles" } });
    console.log("ICI",(await cyclesCategory).id);
    const mountainCategory = datasource.getRepository(Category).findOne({ where: { name: "Montagne" } });
    const aquaCategory = datasource.getRepository(Category).findOne({ where: { name: "Sports aquatiques" } });
    const winterCategory = datasource.getRepository(Category).findOne({ where: { name: "Sports d'hiver" } });
    const campCategory = datasource.getRepository(Category).findOne({ where: { name: "Camping" } });
    const products = [
        {
            "category": (await cyclesCategory),
            "name": "VTT électrique",
            "description": "Partez à l'aventure où vous le souhaitez avec ce vtt électrique",
            "disponibility": true,
            "image": "https://cdn.pixabay.com/photo/2020/09/13/09/50/mountain-bike-5567847_960_720.jpg",
            "price": 35.00 
        },
        {
            "category": (await mountainCategory),
            "name": "Sac à dos trekking 50L",
            "description": "Partez à l'aventure où vous le souhaitez avec ce sac à dos de randonnée",
            "disponibility": true,
            "image": "https://images.pexels.com/photos/1178525/pexels-photo-1178525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "price": 10.00 
        },
        {
            "category": (await aquaCategory),
            "name": "Masque de plongée",
            "description": "Partez à l'aventure où vous le souhaitez avec ce masque de plongée",
            "disponibility": true,
            "image": "https://media.istockphoto.com/id/1059596206/fr/photo/tuba.jpg?b=1&s=612x612&w=0&k=20&c=8dH33EdbbPe1pOPOB4Iy6vqmih6xDXUxvvNP9h3UViY=",
            "price": 7.00 
        },
        {
            "category": (await winterCategory),
            "name": "Snowboard",
            "description": "Partez à l'aventure où vous le souhaitez avec ce snowboard",
            "disponibility": true,
            "image": "https://images.pexels.com/photos/1903935/pexels-photo-1903935.jpeg?auto=compress&cs=tinysrgb&w=600",
            "price": 25.00 
        },
        {
            "category": (await campCategory),
            "name": "Tente 2 pers",
            "description": "Partez à l'aventure où vous le souhaitez avec cette tente pour 2 personnes",
            "disponibility": true,
            "image": "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&w=600",
            "price": 15.00 
        },
        {
            "category": (await aquaCategory),
            "name": "Paddle",
            "description": "Partez à l'aventure où vous le souhaitez avec ce paddle",
            "disponibility": true,
            "image": "https://images.pexels.com/photos/1751550/pexels-photo-1751550.jpeg?auto=compress&cs=tinysrgb&w=600",
            "price": 40.00 
        },
        {
            "category": (await mountainCategory),
            "name": "Baudrier",
            "description": "Partez à l'aventure où vous le souhaitez avec ce baudrier",
            "disponibility": true,
            "image": "https://cdn.pixabay.com/photo/2015/09/09/09/02/forest-climbing-park-931256__480.jpg",
            "price": 12.00 
        },
        {
            "category": (await winterCategory),
            "name": "Paire de skis",
            "description": "Partez à l'aventure où vous le souhaitez avec cette paire de ski",
            "disponibility": true,
            "image": "https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473__480.jpg",
            "price": 25.00 
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

    //...
    return true;
  }
}