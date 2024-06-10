"use client";

import Navbar from "@/components/Navbar";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner"
import { useState, useTransition } from "react";
import { login } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Login() {
    const [isPending, startTransition] = useTransition();
    const [inputState, setInputState] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const password = formData.get("password");
            const res = await login(password);
            
            if (res?.error != undefined) {
                setError("Invalid Password");
            } else {
                setError("");
                redirect("/");
            }
        });
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar page="Login" showLogout={false} />
            <div className="w-full h-full p-4 flex justify-center items-center flex-grow">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter the password provided by Jake</CardDescription>
                    </CardHeader>
                    <form action={onSubmit}>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <Input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" placeholder="Enter password" 
                                        onChange ={(e) => {setInputState(e.target.value)}} 
                                    />
                                    {error && <p className="text-sm text-destructive" >{error}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button className="w-[60px] h-[40px]" disabled={inputState == ""}>
                                {isPending ? <Spinner /> : "Login"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}