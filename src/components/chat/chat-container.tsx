import React, { forwardRef } from 'react'
import { MessageMarkdown } from '../messages/message-markdown'
import ScrollToBottom from './scroll-to-bottom'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback } from '../ui/avatar'
import CopyToClipboard from '../copyToClipboard'
import { Message } from 'ai'
import ChatImage from './chat-image'
import { FilesId } from '../chat'
import Markdown from 'react-markdown'

type props = {
    messages: Message[],
    filesId: FilesId[],
    height: number | undefined
}

const ChatContainer = forwardRef<HTMLDivElement, props>(({messages, filesId, height}, ref) => {
  return (
    <>
        <ScrollToBottom ref={ref} height={height} />
        <ScrollArea 
            ref={ref}
            className="h-[87%] w-full mb-2 rounded-md md:p-4 -mt-6">
            <div className="w-[95%] max-w-4xl lg:w-3/4 mx-auto">
                {messages.map(m => (
                    <div key={m.id} className="pr-3 whitespace-pre-wrap md:pr-12 w-full">
                    {m.role === 'user' && (
                        <div className="my-6 md:my-8 w-full flex flex-wrap pl-8">
                            <div className="ml-auto mt-1.5 text-zinc-300">
                                <div className="flex flex-wrap">
                                    <ChatImage filesIds={filesId} messageId={m.id} />
                                </div>
                                <div className="py-2 px-3 lg:px-4 bg-[#323232] rounded-3xl w-fit ml-auto">
                                    <p className="break-words max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-sm xl:max-w-3xl">
                                        {m.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {m.role === 'assistant' && (
                        <div className="my-6 md:my-8 flex gap-2 md:gap-3 w-full">
                            <Avatar className="h-7 w-7 md:h-10 md:w-10">
                                <AvatarFallback className="bg-[#424242] text-sm lg:text-base text-zinc-200">AI</AvatarFallback>
                            </Avatar>
                            <div className="mt-1 lg:mt-1.5 w-full">
                                <div className="flex justify-between">
                                    <p className="font-semibold text-sm md:text-base">Bot</p>
                                    <CopyToClipboard message={m} />
                                </div>
                                <MessageMarkdown content={m.content} />
                                {/* <Markdown>{m.content}</Markdown> */}
                            </div>
                        </div>
                    )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    </>
  )
})

ChatContainer.displayName = 'ChatContainer';
export default ChatContainer;