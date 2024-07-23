import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import HeaderHoverCard from "../../header-hover-card";
import { PiShootingStarLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import ChatHistory from "../chat-history";

export default function ChatSidebar() {
  const router = useRouter()
  const handlerNewChat = () =>{
    console.log('New Chat')
    router.push('/chat')
  }
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <HeaderHoverCard title="Chat Workspace" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti iusto, distinctio obcaecati tempore aliquam pariatur perferendis libero quod debitis, aperiam labore fugiat a enim modi iure officiis doloremque! Delectus, facilis."/>
        <Button variant={"outline"} onClick={handlerNewChat} className="w-full rounded-xl bg-zinc-200" type="button"><PlusIcon className="mr-2"/>New Chat</Button>
      </div>
      <ChatHistory/>
      <div className="text-zinc-200 px-4 pb-[68px] pt-2 md:py-4">
        <Button className="w-full justify-start flex flex-wrap gap-2 items-center hover:bg-[#323232] bg-transparent p-2 h-auto">
          <div className="p-1.5 border-[1.5px] rounded-full"><PiShootingStarLight className="text-xl"/></div>
          <div className="flex flex-col justify-start">
            <h5 className="text-start">Upgrade Plan</h5>
            <p className="text-sm text-zinc-500">Unlimited Chat</p>
          </div>
        </Button>
      </div>
    </div>
  )
}
