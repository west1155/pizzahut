import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: itemId } = await params;
        const id = Number(itemId);

        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: { id },
        });

        if (!cartItem) {
            return NextResponse.json({ message: 'Cart item not found' }, { status: 404 });
        }

        await prisma.cartItem.delete({
            where: { id },
        });

        const updatedCart = await prisma.cart.findFirst({
            where: { id: cartItem.cartId },
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

        // Recalculate totalAmount
        const totalAmount = updatedCart?.items.reduce((acc, item) => {
            const ingredientsPrice = item.ingredients.reduce((sum, ing) => sum + ing.price, 0);
            return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
        }, 0) || 0;

        await prisma.cart.update({
            where: { id: cartItem.cartId },
            data: { totalAmount },
        });

        return NextResponse.json({ items: updatedCart?.items || [], totalAmount });
    } catch (error) {
        console.error('[CART_ITEM_DELETE] Server error', error);
        return NextResponse.json({ message: 'Failed to delete cart item' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: itemId } = await params;
        const id = Number(itemId);
        const data = (await req.json()) as {
            productItemId: number;
            ingredients: number[];
        };

        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: { id },
        });

        if (!cartItem) {
            return NextResponse.json({ message: 'Cart item not found' }, { status: 404 });
        }

        await prisma.cartItem.update({
            where: { id },
            data: {
                productItemId: data.productItemId,
                ingredients: {
                    set: data.ingredients?.map((id) => ({ id })) || [],
                },
            },
        });

        const updatedCart = await prisma.cart.findFirst({
            where: { id: cartItem.cartId },
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

        // Recalculate totalAmount
        const totalAmount = updatedCart?.items.reduce((acc, item) => {
            const ingredientsPrice = item.ingredients.reduce((sum, ing) => sum + ing.price, 0);
            return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
        }, 0) || 0;

        await prisma.cart.update({
            where: { id: cartItem.cartId },
            data: { totalAmount },
        });

        return NextResponse.json({ items: updatedCart?.items || [], totalAmount });
    } catch (error) {
        console.error('[CART_ITEM_PATCH] Server error', error);
        return NextResponse.json({ message: 'Failed to update cart item' }, { status: 500 });
    }
}
