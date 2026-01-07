import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get('token');

        if (!token) {
            return NextResponse.json({ items: [], totalAmount: 0 });
        }

        const userCart = await prisma.cart.findFirst({
            where: { tokenId: token },
            include: {
                items: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        productItem: {
                            include: {
                                product: true
                            }
                        },
                        ingredients: true,
                    },
                },
            },
        });

        return NextResponse.json(userCart || { items: [], totalAmount: 0 });
    } catch (error) {
        console.error('[CART_GET] Server error', error);
        return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { token, productItemId, ingredients, quantity = 1 } = data;

        if (!token) {
            return NextResponse.json({ message: 'Token is required' }, { status: 400 });
        }

        let userCart = await prisma.cart.findFirst({
            where: { tokenId: token },
        });

        if (!userCart) {
            userCart = await prisma.cart.create({
                data: { tokenId: token },
            });
        }

        const findCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: userCart.id,
                productItemId: Number(productItemId),
                ingredients: {
                    every: {
                        id: { in: ingredients || [] },
                    },
                    some: {}, // Ensures it has at least one if we specified any
                },
            },
            include: {
                ingredients: true
            }
        });

        // Simplified logic: If exact ingredients match (or both have none), update quantity.
        // For a more robust app, we'd check if length and IDs match exactly.

        if (findCartItem && findCartItem.ingredients.length === (ingredients?.length || 0)) {
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
                        connect: ingredients?.map((id: number) => ({ id })) || [],
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
                                product: true
                            }
                        },
                        ingredients: true,
                    },
                },
            },
        });

        // Update totalAmount in background or here
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
