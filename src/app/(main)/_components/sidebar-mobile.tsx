"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminRoutes, Nav, userRoutes } from "@/lib/routes";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IconType } from "react-icons/lib";
import { MdOutlineSchool } from "react-icons/md";
import { TbPrompt } from "react-icons/tb";
import DropdownAvatar from "./dropdown-avatar";
import { useContext, useEffect, useRef } from "react";
import { renderSidebar } from "@/lib/sidebar-mapper";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { Context } from "@/context/context";

export const iconMap: { [key: string]: IconType } = {
  LuLayoutDashboard: LuLayoutDashboard,
  FaRegUser: FaRegUser,
  MdOutlineMessage: MdOutlineMessage,
  MdOutlineSchool: MdOutlineSchool,
  TbPrompt: TbPrompt
};

const SidebarMobile = () => {
  const pathName = usePathname();
  const asideRef = useRef<HTMLElement>(null);
  const {isVisibleMobile: isVisible, setIsVisibleMobile: setIsVisible} = useContext(Context)

  let navigations;
  if (pathName.startsWith('/admin')){
      navigations = adminRoutes;
  } else{
      navigations = userRoutes
  }

  const handleSidebarSwitcherMobile = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    setTimeout(() => {
        if(asideRef.current){
            asideRef.current.style.visibility = "visible"
        }
    }, 100)
    setIsVisible(false);
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
        console.log("Clicked outside the aside");
        setIsVisible(false);
      } else {
        console.log("Clicked inside the aside");
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  // useEffect(() => {
  //   setIsVisible(false);
  // }, [setIsVisible]);
  return (
    <>
      <aside 
        ref={asideRef}
        className={`flex flex-wrap fixed top-0 left-0 z-[50] -ml-2 lg:hidden transition-all ease-in-out duration-300 ${isVisible ? 'translate-x-0' : '-translate-x-80'}`} style={{ "visibility": "hidden" }}>
        <div className="z-40 h-screen w-fit shrink-0 border-r-2 border-zinc-800">
          <div className="relative overflow-hidden h-full px-4 py-4 pb-20 bg-[#181818]">
            <div className="flex flex-col h-full justify-between items-center">
              <div className="w-fit">
                <div className="pb-10">
                  <HiOutlineBars3BottomLeft onClick={handleSidebarSwitcherMobile} className="text-zinc-200 text-3xl cursor-pointer hover:text-zinc-400 transition ease-in-out"/>
                </div>
                {navigations.map((navigation) => {
                  const IconComponent = iconMap[navigation.icon];
                return (
                  <div className="pb-10" key={navigation.title}>
                    <h4 className="text-[28px]  font-semibold">
                      <Link href={navigation.href}>
                        <IconComponent className={`${pathName === navigation.href ? "text-zinc-200" : "text-gray-500"} hover:text-zinc-200  `}/>
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
          className={`bg-[#181818] fixed left-[69px] h-screen`}>
            <div className={`w-64 h-screen`}>
                {renderSidebar(pathName)}
            </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarMobile;
