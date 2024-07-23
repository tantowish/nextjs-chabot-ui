import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RegisterForm from "./form";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "@/components/google-auth-button";

export default async function RegisterPage() {
  const session = await getServerSession()
  if(session){
      redirect('/chat')
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-center text-3xl font-bold">Nextjs Chabot UI</h1>
        <section className="w-full max-w-lg  flex flex-col items-center py-8">
            <h2 className="text-center text-xl mb-4 font-semibold">Sign Up</h2>
            <div className="w-full px-8">
                <RegisterForm/>
                <p className="my-4 text-center">Already have an account? <Link href={'/login'} className="underline">Sign In</Link></p>
            </div>
            <div className="w-full px-8 ">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <Separator className="w-[40%]" />
                    <p className="text-center text-sm text-slate-800 w-[20%]">OR</p>
                    <Separator className="w-[40%]"/>
                </div>
                <GoogleAuthButton text="Sign Up with Google" />
            </div>
        </section>
    </div>
  )
}
