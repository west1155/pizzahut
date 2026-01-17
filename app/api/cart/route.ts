import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id ? Number(session.user.id) : null;
        const token = req.nextUrl.searchParams.get('token');

        if (!token && !userId) {
            return NextResponse.json({ items: [], totalAmount: 0 });
        }

        let userCart = await prisma.cart.findFirst({
            where: userId ? { userId } : { tokenId: token },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        productItem: {
                            include: {
                                product: {
                                    include: {
                                        items: true,
                                        ingredients: true,
                                    }
                                }
                            }
                        },
                        ingredients: true,
                    },
                },
            },
        });

        // If user just logged in and has an anonymous cart, link it to the user
        if (userId && token && !userCart) {
            const anonymousCart = await prisma.cart.findFirst({
                where: { tokenId: token },
            });

            if (anonymousCart) {
                userCart = await prisma.cart.update({
                    where: { id: anonymousCart.id },
                    data: { userId },
                    include: {
                        items: {
                            orderBy: { createdAt: 'desc' },
                            include: {
                                productItem: {
                                    include: {
                                        product: {
                                            include: {
                                                items: true,
                                                ingredients: true,
                                            }
                                        }
                                    }
                                },
                                ingredients: true,
                            },
                        },
                    },
                });
            }
        }

        return NextResponse.json(userCart || { items: [], totalAmount: 0 });
    } catch (error) {
        console.error('[CART_GET] Server error', error);
        return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id ? Number(session.user.id) : null;
        const data = await req.json();
        const { token, productItemId, ingredients, quantity = 1 } = data;

        if (!token && !userId) {
            return NextResponse.json({ message: 'Token or UserId is required' }, { status: 400 });
        }

        let userCart = await prisma.cart.findFirst({
            where: userId ? { userId } : { tokenId: token },
        });

        if (!userCart) {
            userCart = await prisma.cart.create({
                data: {
                    userId: userId,
                    tokenId: token,
                },
            });
        }

        const cartItems = await prisma.cartItem.findMany({
            where: {
                cartId: userCart.id,
                productItemId: Number(productItemId),
            },
            include: {
                ingredients: true
            }
        });

        // Find an item that has EXACTLY the same ingredients
        const findCartItem = cartItems.find((item) => {
            const itemIngredientIds = item.ingredients.map((i) => i.id).sort((a: number, b: number) => a - b);
            const inputIngredientIds = (ingredients || []).map((id: any) => Number(id)).sort((a: number, b: number) => a - b);

            return itemIngredientIds.length === inputIngredientIds.length &&
                itemIngredientIds.every((id, index) => id === inputIngredientIds[index]);
        });

        if (findCartItem) {
            await prisma.cartItem.update({
                where: { id: findCartItem.id },
                data: { quantity: findCartItem.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productItemId: Number(productItemId),
                    quantity,
                    ingredients: {
                        connect: ingredients?.map((id: number) => ({ id: Number(id) })) || [],
                    },
                },
            });
        }

        const updatedCart = await prisma.cart.findFirst({
            where: { id: userCart.id },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        productItem: {
                            include: {
                                product: {
                                    include: {
                                        items: true,
                                        ingredients: true,
                                    }
                                }
                            }
                        },
                        ingredients: true,
                    },
                },
            },
        });

        const totalAmount = updatedCart?.items.reduce((acc, item) => {
            const ingredientsPrice = item.ingredients.reduce((sum, ing) => sum + ing.price, 0);
            return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
        }, 0);

        await prisma.cart.update({
            where: { id: userCart.id },
            data: { totalAmount },
        });

        return NextResponse.json({ ...updatedCart, totalAmount });
    } catch (error) {
        console.error('[CART_POST] Server error', error);
        return NextResponse.json({ message: 'Failed to add to cart' }, { status: 500 });
    }
}
