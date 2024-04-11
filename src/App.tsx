import {Routes, Route} from 'react-router-dom';
import Signin from './_auth/forms/Signin'; // Import the 'Signin' component
import Signup from './_auth/forms/Signup'; // Import the 'Signup' component
import { Home, Explore, Saved, AllUsers, CreatePost, EditPost, PostDetails, Profile,UpdateProfile } from './_root/pages'; // Import the 'Home' component
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout'; // Import the 'RootLayout' component


import './globals.css';
import { Toaster } from "@/components/ui/toaster"


const App = () => {
    return(

        <main className ="flex h-screen">
            <Routes>
                {/* The public routing for all people*/}
                <Route element={<AuthLayout />}>
                    <Route path= "/signup" element={<Signup />}/>

                    <Route path= "/signin" element={<Signin />}/>
                </Route>

                {/* The private routing only for specific people*/}
                <Route element={<RootLayout />}>
                    <Route index element={<Home/>}/>
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/all-users" element={<AllUsers />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:id" element={<EditPost />} />
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/profile/:id/*" element={<Profile />} />
                    <Route path="/update-profile/:id" element={<UpdateProfile />} />

                </Route>
            </Routes>
            <Toaster />
        </main>

    )
}

export default App