import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react"

export default function AvatarProfile({className}: {className?: string}) {
    const {data: session} = useSession()
    const initials = session?.user.name.slice(0, 2).toUpperCase()
  return (
    <Avatar className={className || "w-9 h-9 cursor-pointer border-zinc-200 border-2 flex flex-wrap justify-center items-center"}>
        <AvatarImage src={session?.user.image!} />
        <AvatarFallback className="text-zinc-200 ">{initials}</AvatarFallback>
    </Avatar>     
  )
}
