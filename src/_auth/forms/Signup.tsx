import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Update this import to match your Appwrite API setup
import { createUserAccount } from "@/lib/appwrite/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fullname: z.string().min(2, { message: "Full name must be at least 2 characters long" }),
  username: z.string().min(2, { message: "Username must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email format" }).regex(/@ashesi\.edu\.gh$/, { message: "Email must end with @ashesi.edu.gh" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  repeatpassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatpassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, fullname: name, username } = values;

    try {
      // Update this call to match your Appwrite API setup
      const newUser = await createUserAccount({
        email,
        password,
        name,
        username,
      });
      console.log("User creation response:", newUser);
      if (newUser) {
        
        navigate("/Signin");
        return toast({title: "Account created successfully"});
      }
      
    } catch (error) {
      console.error("Error creating user account:", error);
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
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your First Name then your Last Name"
                  type="text"
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Ashesi Email Address"
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
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Password"
                  type="password"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Repeat Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Repeat Your Password"
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
          {form.formState.isSubmitting ? <div>Loading...</div> : "Sign up"}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account?
          <Link to="/signin" className="text-primary-500">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};
export default Signup;
