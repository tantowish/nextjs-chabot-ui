'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    name: z.string().min(1).max(255),
    email: z.string()
        .min(2, {message: "email minimal 2 karakter"})
        .max(255)
        .email(),
    password: z.string()
        .min(5, {message: "password minimal 5 karakter"})
        .max(255),
    repassword: z.string()
        .min(5, {message: "password minimal 5 karakter"})
        .max(255)
}).refine(data => data.password === data.repassword, {
  message: "Passwords do not match",
  path: ["repassword"],
});

export default function RegisterForm() {
    const router = useRouter();
    const {toast} = useToast()
    const [signingUp, setSigningUp] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            repassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSigningUp(true)
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        if (response?.ok) {
            sessionStorage.setItem('registrationMessage', 'Sign Up successful. Please log in.');
            router.push('/login');
        } else {
            const errorData = await response.json();
            toast({
                variant: "destructive",
                title: "Failed",
                description: errorData.error,
              })
              setSigningUp(false)
        }    
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem className="space-y-0">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input className="py-5" required placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
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
            <FormField
                control={form.control}
                name="repassword"
                render={({ field }) => (
                <FormItem className="space-y-0">
                    <FormLabel>Re-Enter Password</FormLabel>
                    <FormControl>
                        <Input className="py-5" required type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full py-5">{signingUp ? <Spinner /> : "Sign Up"}</Button>
        </form>
  </Form>
  );
}
