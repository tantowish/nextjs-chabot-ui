'use server'

import { prismaClient } from "@/lib/prisma"

export const getPackages = async () =>{
    const packages = await prismaClient.package.findMany({
        orderBy: {
            id: 'asc'
        }
    })
    return packages
} 