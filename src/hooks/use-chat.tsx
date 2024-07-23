import { getChats } from "@/data/chat";
import { useSession } from "next-auth/react";
import useSWRImmutable from "swr/immutable";

export function useChat() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data, isLoading } = useSWRImmutable(
    'chat/'+userId,
    () => getChats(session?.user.email!)
  );

  return {
    data,
    isLoading,
  };
}
