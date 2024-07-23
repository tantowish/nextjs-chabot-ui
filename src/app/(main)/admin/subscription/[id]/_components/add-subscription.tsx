'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoIosAddCircleOutline } from "react-icons/io";
import { DialogDescription } from "@radix-ui/react-dialog";
import SubscriptionForm from "./form";
import { useState } from "react";

export function AddSubscription({ userId }: { userId: number }) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-wrap gap-1 bg-slate-800">
          <IoIosAddCircleOutline />
          <p>Tambah</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Subscription</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SubscriptionForm userId={userId} setIsOpen={setIsOpen}/>
      </DialogContent>
    </Dialog>
  );
}
