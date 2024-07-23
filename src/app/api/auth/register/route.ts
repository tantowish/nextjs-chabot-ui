import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prismaClient } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    console.log({ email, password, name });

    const hashedPassword = await hash(password, 10);

    const user = await prismaClient.user.findUnique({
      where: {
        email: email
      }
    })

    if(user){
      return NextResponse.json({ error: 'Email already taken' }, { status: 409 });
    }

    await prismaClient.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: name,
            role: "user"
        }
    });

    return NextResponse.json({ message: "success" }, {status: 201});
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}