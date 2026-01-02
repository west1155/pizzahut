import {NextResponse} from "next/dist/server/web/spec-extension/response";
import {prisma} from "@/prisma/prisma-client";
import {NextRequest} from "next/dist/server/web/spec-extension/request";


export async function GET() {
    const users = await prisma.user.findMany()
  return NextResponse.json({users});
}


export async function POST(request: NextRequest) {
    const user = await request.json();
    const newUser = await prisma.user.create({
        data: user
    });
    return NextResponse.json({newUser});
}