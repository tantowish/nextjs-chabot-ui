import { prismaClient } from '@/lib/prisma';
import { User } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const chatId = formData.get('chatId') as string;
        const messages = JSON.parse(formData.get('messages') as string);
        const filesId = JSON.parse(formData.get('filesId') as string);

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        // console.log(session)
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await getUser(session?.email!)
        if(!user){
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        let chat;
        if (chatId === "null") {
            chat = await prismaClient.chat.create({
                data: {
                    user_id: user.id,
                    messages: messages,
                    filesId: filesId    
                }
            });
        } else {
            chat = await prismaClient.chat.update({
                where: {
                    id: chatId
                },
                data: {
                    messages: messages,
                    filesId: filesId     
                }
            });
        }

        return NextResponse.json(
            { success: true, message: "Save chat success!", data: chat },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error processing request:', error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

async function getUser(email:string): Promise<User | null>{
    const user = await prismaClient.user.findUnique({
        where:{
            email: email
        }
    })
    return user
}
