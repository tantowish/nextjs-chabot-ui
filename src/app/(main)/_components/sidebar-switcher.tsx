'use client'

import { Context } from "@/context/context";
import { useContext } from "react";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";

export default function SidebarSwitcher() {
  const {isVisibleMobile,setIsVisibleMobile, isVisible, setIsVisible} = useContext(Context)
  const toggleSidebar = () => {
      setIsVisibleMobile(!isVisibleMobile)
      setIsVisible(!isVisible);
  };
  return (
    <div className="absolute top-4 z-[40] left-3">
        <HiOutlineBars3BottomLeft onClick={toggleSidebar} className="text-zinc-200 text-3xl cursor-pointer hover:text-zinc-400 transition ease-in-out"/>
    </div>
  )
}
