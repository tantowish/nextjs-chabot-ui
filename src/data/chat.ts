'use server'

import { prismaClient } from "@/lib/prisma"

export const getChats = async (email: string) =>{
    const chat = await prismaClient.chat.findMany({
        where: {
            user: {
                email: email
            },
            type_id: null
        },
        select: {
            id: true,
            updated_at: true,
            messages: true
        },
        orderBy: {
            updated_at: 'desc'
        }
    })
    return chat
} 

export const getChatByType = async ({email, type_id}: {email: string, type_id: number}) =>{
    const chat = await prismaClient.chat.findMany({
        where: {
            user: {
                email: email
            },
            type_id: type_id
        },
        select: {
            id: true,
            updated_at: true,
            messages: true
        },
        orderBy: {
            updated_at: 'desc'
        }
    })
    return chat
} 