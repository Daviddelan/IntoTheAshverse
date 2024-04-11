import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Update this import to match your Appwrite API setup
import { login } from "@/lib/appwrite/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

const Signin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
  
    try {
      const session = await login({ email, password });
      window.localStorage.setItem("session_id", JSON.stringify(session?.$id));

      if (session) {
        navigate("/");
        return toast({ title: "Success", description: "Logged in successfully" });
      }

      else {
        return toast({ title: "Error", description: "Please check the email and password" });
      }
    } 
    catch (error:any) {
      const errorMessage = error.message || "An error occurred";
      console.error("Error logging in user:", error);
      return toast({ title: "Error", description: errorMessage });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-full mt-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Email Address"
                  type="email"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Password"
                  type="password"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="shad-button_primary">
          {form.formState.isSubmitting ? <div>Loading...</div> : "Sign in"}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Don't have an account yet?
          <Link to="/Signup" className="text-primary-500">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};
export default Signin;