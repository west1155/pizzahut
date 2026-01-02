import { NextResponse } from 'next/server';
import { prisma } from "@/prisma/prisma-client";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const ingredient = await prisma.ingredient.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!ingredient) {
            return NextResponse.json({ message: 'Ingredient not found' }, { status: 404 });
        }

        return NextResponse.json(ingredient);
    } catch (error) {
        console.error('[INGREDIENT_GET_ID]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const ingredient = await prisma.ingredient.update({
            where: {
                id: Number(id),
            },
            data: body,
        });

        return NextResponse.json(ingredient);
    } catch (error) {
        console.error('[INGREDIENT_PATCH_ID]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await prisma.ingredient.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({ message: 'Ingredient deleted' });
    } catch (error) {
        console.error('[INGREDIENT_DELETE_ID]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
