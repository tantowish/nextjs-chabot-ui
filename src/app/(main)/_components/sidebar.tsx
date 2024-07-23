"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminRoutes, userRoutes } from "@/lib/routes";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IconType } from "react-icons/lib";
import { MdOutlineSchool } from "react-icons/md";
import { TbPrompt } from "react-icons/tb";
import DropdownAvatar from "./dropdown-avatar";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { renderSidebar } from "@/lib/sidebar-mapper";
import { Context } from "@/context/context";

export const iconMap: { [key: string]: IconType } = {
  LuLayoutDashboard: LuLayoutDashboard,
  FaRegUser: FaRegUser,
  MdOutlineMessage: MdOutlineMessage,
  MdOutlineSchool: MdOutlineSchool,
  TbPrompt: TbPrompt
};

const Sidebar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const {isVisible} = useContext(Context)

  let navigations;
  if (pathName.startsWith('/admin')){
      navigations = adminRoutes;
  } else{
      navigations = userRoutes
  }

  useEffect(() => {
    const message = sessionStorage.getItem('loginMessage');
    if (message) {
        toast({
            title: "Success",
            description: message,
          })
        sessionStorage.removeItem('loginMessage');
      }
    }, []);

  const sidebarRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = isVisible ? '288px' : isOpen ? '288px' : '0';
    }
  }, [isVisible, isOpen]);
  return (
    <>
      <aside 
        onMouseOver={() => setIsOpen(true)}
        onMouseOut={() => setIsOpen(false)}
        className="hidden top-0 left-0 z-30 -ml-2 lg:flex flex-wrap">
        <div className="z-40 h-screen w-fit shrink-0 border-r-2 border-zinc-800">
          <div className="relative overflow-hidden h-full py-4 px-4 lg:py-8 bg-[#181818]">
            <div className="flex flex-col h-full justify-between items-center">
              <div className="w-fit">
                {navigations.map((navigation) => {
                  const IconComponent = iconMap[navigation.icon];
                return (
                  <div className="pb-10" key={navigation.title}>
                    <h4 className="text-[28px]  font-semibold">
                      <Link href={navigation.href}>
                        <IconComponent className={`${pathName.startsWith(navigation.href) ? "text-zinc-200" : "text-gray-500"} hover:text-zinc-200`}/>
                      </Link>
                    </h4>
                  </div>
                )})}
              </div>
              <div>
                  <DropdownAvatar />
              </div>
            </div>
          </div>
        </div>
        <div 
          className={`bg-[#181818] transition-all duration-300 ease-in-out`}
          ref={sidebarRef}>
            <div className={`w-72 transition-all duration-300 ease-in-out h-screen ${isVisible ? 'translate-x-0' : isOpen ? 'translate-x-0' : '-translate-x-72'}`}>
                {renderSidebar(pathName)}
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
