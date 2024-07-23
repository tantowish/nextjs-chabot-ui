import { createSubs, deleteSubs, getSubs } from "@/data/subscription";
import { useSession } from "next-auth/react";
import useSWRImmutable from "swr/immutable";

export type CreateSubProps = {
    user_id: number,
    package_id: number,
    price: number,
    start_date: Date,
    end_date: Date,
}

export function useSubscription() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data, isLoading } = useSWRImmutable(
    'subs/'+userId,
    () => getSubs(session?.user.email!)
  );

  const createSubscription = async (data: CreateSubProps) => {
    await createSubs(data)
  }

  const deleteSubscription = async (id: number) => {
    await deleteSubs(id)
  }

  return {
    data,
    isLoading,
    createSubscription,
    deleteSubscription
  };
}
