'use client'

import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { CiUser, CiSettings, CiCreditCard1, CiLogout    } from "react-icons/ci";

export default function DropdownAvatar() {
    const {data: session} = useSession()
    const initials = session?.user.name.slice(0, 2).toUpperCase()

    const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await signOut();
      };
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Avatar className="w-9 h-9 cursor-pointer border-zinc-200 border-2 flex flex-wrap justify-center items-center">
                <AvatarImage src={session?.user.image!} />
                <AvatarFallback className="text-zinc-200 ">{initials}</AvatarFallback>
            </Avatar>              
        </PopoverTrigger>
        <PopoverContent className="ml-3 w-56 bg-[#282828] text-zinc-200 rounded-xl border-none border-zinc-700 shadow-xl">
            <h4 className="px-3 pt-2">{session?.user.name}</h4>
            <Separator className="mt-2 bg-zinc-600" />
            <div className="flex flex-col">
                <Link className="hover:bg-zinc-700 p-3 w-56 flex flex-wrap gap-2 items-center" href={"/profile"}><CiUser className="text-xl"/>profile</Link>
                <Link className="hover:bg-zinc-700 p-3 w-56 flex flex-wrap gap-2 items-center" href={"/setting"}><CiSettings className="text-xl"/>setting</Link>
                <Link className="hover:bg-zinc-700 p-3 w-56 flex flex-wrap gap-2 items-center" href={"/subscription"}><CiCreditCard1  className="text-xl"/>subscription</Link>
                <button onClick={handleSignOut} className="hover:bg-zinc-700 p-3 w-56 flex flex-wrap gap-2 items-center"><CiLogout className="text-xl"/>logout</button>
            </div>
        </PopoverContent>
    </Popover>  
    )
}
