import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Message } from "ai";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getDateLabel } from "@/lib/day-mapper";
import Spinner from "@/components/spinner";
import { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "@/context/context";
import { Typewriter } from "react-simple-typewriter";
import { useSession } from "next-auth/react";
import { getChats } from "@/data/chat";

export default function ChatHistory() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const displayedLabels = new Set<string>();
    const { chats, setChats } = useContext(Context);
    const { data: session } = useSession();
    const email = session?.user.email;

    const fetchChats = useCallback(async () => {
        setIsLoading(true);
        if (email) {
            const data = await getChats(email);
            setChats(data);
        }
        setIsLoading(false);
    }, [email, setChats]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    return (
        <>
            {isLoading ? (
                <div className="w-full h-full flex flex-wrap justify-center items-center">
                    <Spinner className="h-5 w-5 animate-spin text-zinc-200" />
                </div>
            ) : (
                <ScrollArea className="overflow-y-auto h-full px-4 pt-2">
                    <ScrollBar orientation="vertical" />
                    <div className="flex flex-col gap-2 h-full overflow-y-auto">
                        {chats?.map((chat, index) => {
                            const parsedMessages = chat.messages as unknown as Message[];
                            const firstMessage = parsedMessages.length > 0 ? parsedMessages[0] : null;
                            const updatedAt = new Date(chat.updated_at);
                            const dateLabel = getDateLabel(updatedAt);
                            const shouldDisplayLabel = !displayedLabels.has(dateLabel);
                            if (shouldDisplayLabel) {
                                displayedLabels.add(dateLabel);
                            }

                            const truncatedText = firstMessage?.content.length! > 26
                                ? firstMessage?.content.substring(0, 26) + "..."
                                : firstMessage?.content;
                            return (
                                <div key={chat.id}>
                                    {shouldDisplayLabel && (
                                        <div className="text-zinc-400 text-sm px-2 my-1">
                                            {dateLabel}
                                        </div>
                                    )}
                                    <Link href={`/chat/${chat.id}`} className="w-full">
                                        <Button variant={"default"} className="bg-transparent shadow-none hover:bg-[#323232] w-full justify-start px-2 text-zinc-200">
                                            {(index === 0) ? (
                                                <Typewriter
                                                    words={[truncatedText!]}
                                                    loop={1}
                                                />
                                            ) : (
                                                truncatedText
                                            )}
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            )}
        </>
    );
}