'use client'

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function Login() {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let { toast } = useToast();

  let onLogin = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => {
      if (res.ok) {
        toast({
          title: "Logged in",
          description: "You have been logged in",
          style: { backgroundColor: "green", color: "white", opacity: 0.6 },
        });
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/";
        }, 2000);

      } else {
        setLoading(false);
        toast({
          title: "Error",
          description: "Invalid username or password",
          style: { backgroundColor: "red", color: "white", opacity: 0.6 },
        });
      }
    }).catch((_) => {
      console.log("hola?");
      setLoading(false);
      toast({
        title: "Error",
        description: "An error occurred",
        style: { backgroundColor: "red", color: "white", opacity: 0.6 },
      });
    });
  }

  return (
    <>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Card className="w-3/12">
          <CardTitle className="pt-4 flex justify-center text-xl">
            Login
          </CardTitle>
          <CardContent>
            <div className="flex flex-col gap-2 justify-center">
              <span className="text-sm">Username</span>
              <Input type='text' onChange={(e: any) => setUsername(e.target.value)} />
              <span className="text-sm">Password</span>
              <Input type='password' onChange={(e: any) => setPassword(e.target.value)} />

              <Button className="mt-4" onClick={onLogin} loading={loading}>Login</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
