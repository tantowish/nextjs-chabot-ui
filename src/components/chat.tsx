'use client'

import { Message, useChat } from "ai/react"; 
import { useEffect, useRef, useState } from "react";
import { toast } from "./ui/use-toast";
import ChatForm from "./chat/chat-form";
import ChatContainer from "./chat/chat-container";

export type FilesId = {
    imageUrl: string;
    id: string;
}

type props = {
    savedMessages?: Message[],
    savedFilesId?: FilesId[],
    savedChatId?: string
}

export default function Chat({savedMessages, savedFilesId, savedChatId}: props) {
    const { messages, input, handleInputChange, isLoading, handleSubmit: originalHandleSubmit, error, setMessages } = useChat();
    const [files, setFiles] = useState<File[]>([])
    const [filesId, setFilesId] = useState<FilesId[]>([])
    const [fileUploaded, setFileUploaded] = useState<Record<string, string>>({});
    const [chatId, setChatId] = useState<string | null>(null)
    const scrollableChatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        console.log('checking saved message')
        if(savedMessages){
            setMessages(savedMessages)
        } 
        if(savedFilesId){
            setFilesId(savedFilesId)
        }
        if(savedChatId){
            setChatId(savedChatId)
        }
    }, [])

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!input.trim()) {
            return;
        }
        
        setTimeout(() => {
            if(scrollableChatContainerRef.current !== null){
                scrollableChatContainerRef.current.scrollTo({
                    top: scrollableChatContainerRef.current.scrollHeight,
                    behavior: "smooth"
                }) 
            }
        })

        if(files){
            const data: Record<string, string> = fileUploaded;
            originalHandleSubmit(event, {data});

            setFiles([])
            console.log('selesai handle submit')
        } else{
            originalHandleSubmit(event);
        }
    };

    useEffect(() => {
        if(error){
            toast({
                title: error?.name,
                description: error?.message,
                variant: "destructive",
            })
        }
    }, [error])
  return (
    <>
        <div className="relative flex h-screen flex-col items-center justify-center text-zinc-200">
            <ChatContainer messages={messages} filesId={filesId} ref={scrollableChatContainerRef} height={scrollableChatContainerRef.current?.scrollHeight}/>
            <div className="bottom-0 fixed w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
                <ChatForm 
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    input={input}
                    handleInputChange={handleInputChange}
                    filesId={filesId}
                    setFilesId={setFilesId}
                    files={files}
                    setFiles={setFiles}
                    fileUploaded={fileUploaded}
                    setFileUploaded={setFileUploaded}
                    chatId={chatId}
                    setChatId={setChatId}
                    messages={messages}   
                />
            </div>
        </div>
    </>
  )
}
