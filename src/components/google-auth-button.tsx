'use client'

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import Spinner from "./spinner";

export default function GoogleAuthButton({text}:{text:string}) {
  const [loading, setLoading] = useState<boolean>(false);

  async function googleAuth(){
    sessionStorage.setItem('loginMessage', 'Sign In success. Enjoy your AI :D');
    setLoading(true);
    await signIn('google')
    setLoading(false)
  }
  return (
    <Button className="w-full py-5" variant={"outline"} onClick={googleAuth}>
      {loading ? <Spinner/> : (
        <>
          <FaGoogle />
          <p className="ml-2">{text}</p>
        </>)
      }
    </Button>
  )
}
