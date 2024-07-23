import Chat, { FilesId } from "@/components/chat";
import { prismaClient } from "@/lib/prisma";
import { Message } from "ai";
import { redirect } from "next/navigation";

interface Props {
  params: {
    chatId: string;
  };
}

export default async function ChatHistoryPage({params}: Props) {
  const chat = await prismaClient.chat.findUnique({
    where: {
      id: params.chatId
    }
  })

  if(!chat){
    redirect('/chat')
  }
  const messages = chat?.messages as unknown as Message[]
  const filesId = chat?.filesId as FilesId[]
  return (
      <Chat savedMessages={messages} savedFilesId={filesId} savedChatId={chat?.id}/>
  )
}
