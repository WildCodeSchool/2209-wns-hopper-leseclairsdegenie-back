import {Field, FieldResolver, ID, InputType, Int, ObjectType, Root} from "type-graphql";
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Category} from "./Category";
import {Reservation} from "./Reservation";
import datasource from "../utils";
import {LessThanOrEqual, MoreThanOrEqual} from "typeorm";
import {Arg} from "type-graphql";

@Entity()
@ObjectType()
export class Product {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({nullable: true})
    @Field({nullable: true})
    description: string;

    @Column({nullable: true})
    @Field({nullable: true})
    image: string;

    @Column()
    @Field()
    price: number;

    @Column({nullable: true})
    @Field({nullable: true})
    quantity: number;

    @Column({default: true, nullable: true})
    @Field({defaultValue: true, nullable: true})
    disponibility: boolean;

    @Field(() => [Reservation], {nullable: true})
    @OneToMany(() => Reservation, "product", {nullable: true})
    reservations: Reservation[];

    @Field(() => Category, {nullable: true})
    @ManyToOne(() => Category, "product", {nullable: true})
    category: Category;

    @Field(() => [ProductAvailability])
    async availability(
        @Root() currentProduct: Product,
        @Arg("startDate", () => Date) startDate: Date,
        @Arg("endDate", () => Date) endDate: Date,
    ): Promise<ProductAvailability[]> {
        const availableDates: ProductAvailability[] = [];
        const product = await datasource
            .getRepository(Product)
            .findOne({where: {id: currentProduct.id}, relations: {category: true}});
        const lastDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        for (let date = new Date(startDate); date <= lastDate; date.setDate(date.getDate() + 1)) {
            let availableQuantity = product.quantity;
            const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
            const endOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
            const reservations =
                (
                    await datasource
                        .getRepository(Reservation)
                        .find({
                            where: [
                                {
                                    product: {id: product.id},
                                    startDate: LessThanOrEqual(startOfDate),
                                    endDate: MoreThanOrEqual(startOfDate)
                                },
                                {
                                    product: {id: product.id},
                                    startDate: MoreThanOrEqual(startOfDate),
                                    endDate: MoreThanOrEqual(endOfDate)
                                },
                                {
                                    product: {id: product.id},
                                    startDate: LessThanOrEqual(startOfDate),
                                    endDate: MoreThanOrEqual(endOfDate)
                                }
                            ]
                        })
                );
            for (const reservation of reservations) {
                availableQuantity -= reservation.quantity;
            }
            availableDates.push({date: new Date(date), quantity: availableQuantity});
        }
        return availableDates;
    }
}

@InputType()
export class ProductInput {
    @Field()
    name: string;

    @Field({nullable: true})
    description: string;

    @Field({nullable: true})
    image: string;

    @Field()
    price: number;

    @Field({nullable: true})
    quantity: number;

    @Field({defaultValue: true, nullable: true})
    disponibility: boolean;

    @Field({nullable: true})
    categoryId: number;
}

@ObjectType()
class ProductAvailability {
    @Field(() => Date)
    date: Date;

    @Field(() => Int)
    quantity: number;
}
