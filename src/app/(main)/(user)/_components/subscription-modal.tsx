'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useSubscription } from "@/hooks/use-subscription";
import { useEffect, useState } from "react";
import { PiShootingStarLight } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";


export function SubscriptionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const {data, isLoading} = useSubscription()

    useEffect(() => {
        if(!isLoading){
            console.log(data)
            if(data?.length === 0){
                setIsOpen(true)
            }
        }
    }, [data])
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-[#242424] text-zinc-200 border-2 text-left border-[#202020] max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg md:text-xl font-bold text-center">Upgrade Your Plan</AlertDialogTitle>
          <AlertDialogDescription className="text-zinx-200">
            <div className="flex flex-col mt-4 gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                    <PiShootingStarLight className="text-2xl md:text-3xl"/>
                    <p className="text-2xl md:text-3xl font-semibold">Tentiran Plus</p>
                </div>
                <div className="text-xl md:text-2xl text-zinc-300 text-left">Rp25.000<span className="text-sm md:text-base text-zinc-400">/bulan</span> </div>
                <div className="flex flex-col gap-4 py-5 text-base">
                    <div className="flex flex-wrap gap-2 items-center"><FaCheckCircle />Unlimited Chat</div>
                    <div className="flex flex-wrap gap-2 items-center"><FaCheckCircle />Access to advanced image analysis</div>
                    <div className="flex flex-wrap gap-2 items-center"><FaCheckCircle />Access to custom chat</div>
                    <div className="flex flex-wrap gap-2 items-center"><FaCheckCircle />Access to latih tanding</div>
                </div>
                <div className="w-full">
                    <Button className="w-full rounded-2xl bg-[#424242] hover:bg-[#383838] text-zinc-200 py-5">Upgrade to Tentiran Plus</Button>
                </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
