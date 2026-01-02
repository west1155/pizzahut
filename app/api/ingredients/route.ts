import { NextResponse } from 'next/server';
import { prisma } from "@/prisma/prisma-client";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany();
        return NextResponse.json(ingredients);
    } catch (error) {
        console.error('[INGREDIENTS_GET]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, price, imageUrl } = body;

        if (!name || !price || !imageUrl) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const ingredient = await prisma.ingredient.create({
            data: {
                name,
                price,
                imageUrl,
            },
        });

        return NextResponse.json(ingredient);
    } catch (error) {
        console.error('[INGREDIENTS_POST]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
