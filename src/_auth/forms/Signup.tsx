import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Update this import to match your Appwrite API setup
import { createUserAccount } from "@/lib/appwrite/api";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const defaultTheme = createTheme();

const formSchema = z.object({
  fullname: z.string().regex(/^[a-zA-Z\- ]+$/, { 
    message: "Full name can only contain letters, spaces, and hyphens" 
  }).min(2, { 
    message: "Full name must be at least 2 characters long" 
  }),
  username: z.string().min(2, { 
    message: "Username must be at least 2 characters long" 
  }),
  email: z.string().email({ 
    message: "Invalid email format" 
  }).regex(/@ashesi\.edu\.gh$/, { 
    message: "Email must end with @ashesi.edu.gh" 
  }),
  password: z.string().min(8, { 
    message: "Password must be at least 8 characters long" 
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  }),
  repeatpassword: z.string().min(8, { 
    message: "Password must be at least 8 characters long" 
  })
});

export default function SignUp() {
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

  const onSubmit = async (formData: { fullname: string; username: string; email: string; password: string; repeatpassword: string; }) => {
    const { email, password, fullname: name, username } = formData;

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
        navigate("/");
        return toast({ title: "Account created successfully" });
      }

    } catch (error) {
      console.error("Error creating user account:", error);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1 }}>
              <img
                src="/assets/images/Ashesi.jpeg"//picture avatar
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullname"
              label="Full Name"
              {...form.register('fullname')}
              error={!!form.formState.errors.fullname}
              helperText={form.formState.errors.fullname?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              {...form.register('username')}
              error={!!form.formState.errors.username}
              helperText={form.formState.errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              {...form.register('email')}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              {...form.register('password')}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Repeat Password"
              type="password"
              id="repeatpassword"
              {...form.register('repeatpassword')}
              error={!!form.formState.errors.repeatpassword}
              helperText={form.formState.errors.repeatpassword?.message}
            />
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}