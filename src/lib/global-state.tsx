'use client'

import { Context } from "@/context/context";
import { Chat, Prisma } from "@prisma/client";
import { FC, useState } from "react";


interface GlobalStateProps {
    children: React.ReactNode
}

export type ChatHistory = Pick<Chat, "id" | "messages" | "updated_at">

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
    // Sidebar state
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const [isVisibleMobile, setIsVisibleMobile] = useState<boolean>(false)

    // Chat History state
    const [chats, setChats] = useState<ChatHistory[]>([])
    return (
        <Context.Provider
            value={{ 
                isVisible,
                setIsVisible,
                isVisibleMobile,
                setIsVisibleMobile,
                chats,
                setChats
             }}
        >{children}</Context.Provider>
    )
}