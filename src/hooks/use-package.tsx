import { getPackages } from "@/data/package";
import { useSession } from "next-auth/react";
import useSWRImmutable from "swr/immutable";

export function usePackage() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data, isLoading } = useSWRImmutable(
    'packages/'+userId,
    () => getPackages()
  );

  return {
    data,
    isLoading,
  };
}