'use server'

import { CreateSubProps } from "@/hooks/use-subscription"
import { prismaClient } from "@/lib/prisma"

export const getSubs = async (email: string) =>{
    const subs = await prismaClient.subscription.findMany({
        where: {
            user: {
                email: email
            },
            end_date: {
                gte: new Date()
            }
        },
        orderBy: {
            updated_at: 'desc'
        }
    })
    return subs
} 

export const createSubs = async (data: CreateSubProps) =>{
    const subs = await prismaClient.subscription.create({
        data: data
    })
    return subs
} 

export const deleteSubs = async (id: number) =>{
    const subs = await prismaClient.subscription.delete({
        where:{
            id: id
        }
    })
    return subs
} 