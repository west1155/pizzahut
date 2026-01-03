import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { importAllImages } from "@/lib/importImages";


const prisma = new PrismaClient();
const images = importAllImages()

const randomDecimalNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};


const generateProductItem = ({
    productId,
    pizzaType,
    size,
}: {
    productId: number;
    pizzaType?: number;
    size?: number;

}) => {
    return {
        productId,
        price: randomDecimalNumber(5, 20),
        pizzaType,
        size,
    } as Prisma.ProductItemUncheckedCreateInput;
};

const ingredients = [
    {
        name: 'Cheese border',
        price: 2,
        imageUrl: images['cheese_boarder']
    },
    {
        name: 'Creamy mozzarella',
        price: 2.3,
        imageUrl: images['creamy_mozarella']
    },
    {
        name: 'Cheddar and Parmesan cheeses',
        price: 1.5,
        imageUrl: images['cheddar_cheeses']
    },
    {
        name: 'Hot Jalapeno Pepper',
        price: 2,
        imageUrl: images['jalapeno_pepper']
    },
    {
        name: 'Tender Chicken',
        price: 2.5,
        imageUrl: images['tender_chiken']
    },
    {
        name: 'Champignons',
        price: 1.2,
        imageUrl: images['champinions']
    },
    {
        name: 'Ham',
        price: 79,
        imageUrl: images['ham']
    },
    {
        name: 'Spicy pepperoni',
        price: 1,
        imageUrl: images['spicy_peperoni']
    },
    {
        name: 'Spicy Chorizo',
        price: 1.2,
        imageUrl: images['spicy_chorizo']
    },
    {
        name: 'Pickled cucumbers',
        price: 1,
        imageUrl: images['pickled_cucambers']
    },
    {
        name: 'Fresh Tomatoes',
        price: 1,
        imageUrl: images['fresh_tomatoes']
    },
    {
        name: 'Red onion',
        price: 0.5,
        imageUrl: images['red_onions']
    },
    {
        name: 'Juicy Pineapple',
        price: 2,
        imageUrl: images['juicy_pineapple']
    },
    {
        name: 'Italian Herbs',
        price: 2,
        imageUrl: images['italian_herbs']
    },
    {
        name: 'Sweet pepper',
        price: 1,
        imageUrl: images['sweet_peper']
    },
    {
        name: 'Feta cheese cubes',
        price: 1,
        imageUrl: images['feta_cheese']
    },
    {
        name: 'Meatballs',
        price: 2,
        imageUrl: images['meatballs']
    },
].map((obj, index) => ({ id: index + 1, ...obj }));

async function up() {
    await prisma.user.createMany({
        data: [
            {
                fullName: 'User',
                email: 'user@test.ru',
                password: hashSync('111111', 10),
                verified: new Date(),
                role: 'USER',
            },
            {
                fullName: 'Admin',
                email: 'admin@test.ru',
                password: hashSync('111111', 10),
                verified: new Date(),
                role: 'ADMIN',
            },
        ],
    });

    await prisma.category.createMany({
        data: [
            {
                name: 'Pizza',
            },
            {
                name: 'Breakfast',
            },
            {
                name: 'Snacks',
            },
            {
                name: 'Desserts',
            },
            {
                name: 'Drinks',
            },
        ],
    });

    await prisma.product.createMany({
        data: [
            {
                name: 'Omelet with ham and mushrooms',
                imageUrl: images['omlet_ham_mushrooms'],
                categoryId: 2,
            },
            {
                name: 'Omelet with peperoni',
                imageUrl: images['omlete_with_peperoni'],
                categoryId: 2,
            },
            {
                name: 'Sandwich with ham and cheese',
                imageUrl: images['sandwich_ham_cheese'],
                categoryId: 3,
            },
            {
                name: 'Chicken nuggets',
                imageUrl: images['chicken_nuggets'],
                categoryId: 3,
            },
            {
                name: 'Chips from oven with cheese',
                imageUrl: images['chips_from_oven'],
                categoryId: 3,
            },
            {
                name: 'Doter',
                imageUrl: images['doter'],
                categoryId: 3,
            },
            {
                name: 'Spicy doter',
                imageUrl: images['spicy_doter'],
                categoryId: 3,
            },
            {
                name: 'Banana milkshake',
                imageUrl: images['banana_milkshake'],
                categoryId: 4,
            },
            {
                name: 'Caramel milkshake',
                imageUrl: images['caramel_milkshake'],
                categoryId: 4,
            },
            {
                name: 'Milkshake with Oreo',
                imageUrl: images['milkshake_oreo'],
                categoryId: 4,
            },
            {
                name: 'Classic milkshake',
                imageUrl: images['classic_milkshake'],
                categoryId: 4,
            },
            {
                name: 'Irish Cappuchino',
                imageUrl: images['capuchino_herb'],
                categoryId: 5,
            },
            {
                name: 'Coffee Caramel Cappuccino',
                imageUrl: images['coffee_caramel'],
                categoryId: 5,
            },
            {
                name: 'Coffee with coconut syrup',
                imageUrl: images['coofee_cocnut'],
                categoryId: 5,
            },
            {
                name: 'Coffee americano',
                imageUrl: images['coffee_americano'],
                categoryId: 5,
            },
            {
                name: 'Coffee latte',
                imageUrl: images['coffee_latte'],
                categoryId: 5,
            },
        ],
    });

    await prisma.ingredient.createMany({
        data: ingredients,
    });

    const pizza1 = await prisma.product.create({
        data: {
            name: 'Peperoni fresh',
            imageUrl: images['pizza_kolbasa'],
            categoryId: 1,
            ingredients: {
                connect: ingredients.slice(0, 5),
            },
        },
    });

    const pizza2 = await prisma.product.create({
        data: {
            name: 'Cheese',
            imageUrl: images['pizza_cheese'],
            categoryId: 1,
            ingredients: {
                connect: ingredients.slice(5, 10),
            },
        },
    });

    const pizza3 = await prisma.product.create({
        data: {
            name: 'Chorizo fresh',
            imageUrl: images['pizza_cholo'],
            categoryId: 1,
            ingredients: {
                connect: ingredients.slice(10, 40),
            },
        },
    });

    await prisma.productItem.createMany({
        data: [
            generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 40 }),

            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 30 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 40 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 20 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 40 }),

            generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 40 }),

            generateProductItem({ productId: 1 }),
            generateProductItem({ productId: 2 }),
            generateProductItem({ productId: 3 }),
            generateProductItem({ productId: 4 }),
            generateProductItem({ productId: 5 }),
            generateProductItem({ productId: 6 }),
            generateProductItem({ productId: 7 }),
            generateProductItem({ productId: 8 }),
            generateProductItem({ productId: 9 }),
            generateProductItem({ productId: 10 }),
            generateProductItem({ productId: 11 }),
            generateProductItem({ productId: 12 }),
            generateProductItem({ productId: 13 }),
            generateProductItem({ productId: 14 }),
            generateProductItem({ productId: 15 }),
            generateProductItem({ productId: 16 }),
            generateProductItem({ productId: 17 }),
        ],
    });

    await prisma.cart.createMany({
        data: [
            {
                userId: 1,
                totalAmount: 0,
            },
            {
                userId: 2,
                totalAmount: 0,
            },
        ],
    });

    await prisma.cartItem.create({
        data: {
            productItemId: 1,
            cartId: 1,
            userId: 1,
            quantity: 1,
            pizzaSize: 20,
            ingredients: {
                connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
        },
    });
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE;`;
}

async function main() {
    try {
        await down();
        await up();
    } catch (e) {
        console.error(e);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
