import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const query = req.nextUrl.searchParams.get('query') || '';

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            take: 5,
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('[SEARCH_GET]', error);
        return NextResponse.json({ message: 'Internal error' }, { status: 500 });
    }
}
