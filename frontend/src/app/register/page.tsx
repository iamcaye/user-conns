'use client'

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
import { zodResolver } from "@hookform/resolvers/zod";

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
  dob: z.string(),
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
    fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((response) => {
      console.log(response);
    });
  }


  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-between p-12">
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
                      <FormControl>
                        <Input
                          {...registerForm.register(field.field)}
                          type={field.type}
                          required={field.required}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex justify-center">
                <Button type="submit">Register</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
