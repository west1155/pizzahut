import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, fullName, password } = body;

        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
