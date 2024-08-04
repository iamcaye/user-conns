'use client'

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Toaster } from "@/components/ui/toaster";

export interface IFormField {
  field: string;
  type: string;
  label: string;
  required: boolean;
}

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  name: z.string().min(3),
  last_name: z.string().min(3),
  dob: z.date(),
  country: z.string().min(3),
  state: z.string().min(3),
  city: z.string().min(3),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

const registerFields: IFormField[] = [
  { field: "username", type: "text", label: "Username", required: true },
  { field: "email", type: "email", label: "Email", required: true },
  { field: "name", type: "text", label: "Name", required: true },
  { field: "last_name", type: "text", label: "Last Name", required: true },
  { field: "dob", type: "date", label: "Date of Birth", required: true },
  { field: "country", type: "text", label: "Country", required: true },
  { field: "state", type: "text", label: "State", required: true },
  { field: "city", type: "text", label: "City", required: true },
  { field: "password", type: "password", label: "Password", required: true },
  { field: "confirmPassword", type: "password", label: "Confirm Password", required: true },
];

export default function Register() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  let registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      dob: "",
      last_name: "",
      country: "",
      state: "",
      city: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof registerSchema>) {
    setLoading(true);
    fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        toast({
          title: "User created",
          description: "User has been created successfully",
          style: { backgroundColor: "green", color: "white", opacity: 0.6 },
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "There was an error creating the user",
          style: { backgroundColor: "red", color: "white", opacity: 0.6 },
        });
        setLoading(false);
      }
    })
  }


  return (
    <main className="flex w-full min-h-screen flex-col items-center p-12 pt-20">
      <Toaster />
      <Card className="w-6/12">
        <CardTitle className="pt-4 flex justify-center text-xl">
          Register
        </CardTitle>
        <CardContent>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-4">
              {registerFields.map((field, index) => (
                <FormField
                  control={registerForm.control}
                  key={index}
                  name={field.field}
                  render={({ fieldState }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      {['text', 'password', 'email'].includes(field.type) &&
                        <FormControl>

                          <Input
                            {...registerForm.register(field.field)}
                            type={field.type}
                            required={field.required}
                          />
                        </FormControl>
                      }
                      {field.type === 'date' &&
                        <>
                          <br />
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button

                                  variant={"outline"}
                                  className="w-full"
                                >
                                  {registerForm.getValues(field.field) ? (
                                    format(registerForm.getValues(field.field), "yyyy-MM-dd")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="center">
                              <Calendar
                                captionLayout="dropdown"
                                mode="single"
                                selected={registerForm.getValues(field.field)}
                                onSelect={(date) => {
                                  console.log(date);
                                  registerForm.setValue(field.field, date);
                                  registerForm.trigger(field.field);
                                }}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </>
                      }
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex justify-center">
                <Button loading={loading} type="submit">Register</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );

}
