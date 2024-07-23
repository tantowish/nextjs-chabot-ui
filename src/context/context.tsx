import { ChatHistory } from "@/lib/global-state";
import { Dispatch, SetStateAction, createContext } from "react";

interface Context {
    isVisible: boolean,
    setIsVisible: Dispatch<SetStateAction<boolean>>
    isVisibleMobile: boolean,
    setIsVisibleMobile: Dispatch<SetStateAction<boolean>>
    chats: ChatHistory[]
    setChats: Dispatch<SetStateAction<ChatHistory[]>>
}

export const Context = createContext<Context>({
    isVisible: true,
    setIsVisible: () => {},
    isVisibleMobile: false,
    setIsVisibleMobile: () => {},
    chats: [],
    setChats: () => {}
})