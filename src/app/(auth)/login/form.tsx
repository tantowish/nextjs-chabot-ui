'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";

const formSchema = z.object({
    email: z.string()
        .min(2, {message: "email minimal 2 karakter"})
        .max(255)
        .email(),
    password: z.string().min(1).max(255)
})

export default function LoginForm() {
    const router = useRouter();
    const { toast } = useToast()
    const [signingIn, setSigningIn] = useState<boolean>(false);

    useEffect(() => {
        const message = sessionStorage.getItem('registrationMessage');
        if (message) {
            toast({
                title: "Success",
                description: message,
              })
            sessionStorage.removeItem('registrationMessage');
        }
    }, [toast]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSigningIn(true)
        const result = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
        });

        if (result?.ok) {
            sessionStorage.setItem('loginMessage', 'Sign In success. Enjoy your AI :D');
            router.push('/chat');
        } else {
            toast({
                variant: "destructive",
                title: "Failed",
                description: "Sign In failed. Please check your credentials",
              })
            setSigningIn(false)
        }    
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem className="space-y-0">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input className="py-5" required  placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem className="space-y-0">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input className="py-5" required type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full py-5">{signingIn ? <Spinner /> : "Sign In"}</Button>
        </form>
  </Form>
  );
}
