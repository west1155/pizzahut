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
                                product: true
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
