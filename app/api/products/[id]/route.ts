import {NextResponse} from 'next/server';
import {prisma} from "@/prisma/prisma-client";


export async function GET(_: Request, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;

    const product = await prisma.product.findFirst({
        where: {
            id: Number(id),
        },
        include: {
            ingredients: true,
            items: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    product: {
                        include: {
                            items: true,
                        },
                    },
                },
            },
        },
    });

    return NextResponse.json(product);
}