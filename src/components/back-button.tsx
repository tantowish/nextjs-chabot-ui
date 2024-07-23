"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { FaArrowLeft } from "react-icons/fa6";
import { useState } from "react";
import Spinner from "./spinner";

export default function BackButton({href}: {href: string}) {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = () => {
        setLoading(true);
    };

  return (
    <Link href={href}>
        <Button 
        className="text-zinc-200 bg-slate-800 flex flex-wrap gap-2 items-center" 
        variant={"default"} 
        onClick={handleClick}
        >
            <FaArrowLeft/>
            {loading ? <Spinner/> :
                <p>Kembali</p>
            }
        </Button>
    </Link>
  )
}
