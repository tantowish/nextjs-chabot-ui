import LoginForm from "./form";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "@/components/google-auth-button";

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-center text-3xl font-bold">nextjs chabot ui</h1>
        <section className="w-full max-w-lg  flex flex-col items-center py-8">
            <h2 className="text-center text-xl mb-4 font-semibold">Sign In</h2>
            <div className="w-full px-8">
                <LoginForm/>
                <p className="my-4 text-center">Don&apos;t have an account? 
                    <Link href={'/register'} className="underline">Sign Up</Link>
                </p>
            </div>
            <div className="w-full px-8">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <Separator className="w-[40%]" />
                    <p className="text-center text-sm text-slate-800 w-[20%]">OR</p>
                    <Separator className="w-[40%]"/>
                </div>
                <GoogleAuthButton text="Sign In with Google" />
            </div>
        </section>
    </div>
  )
}
