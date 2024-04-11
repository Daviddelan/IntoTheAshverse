import { Outlet, Navigate } from "react-router-dom";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"


const AuthLayout = () => {
    const userAuthenticated = false;

    return (
        <>
            {userAuthenticated ? (
                <Navigate to="/" /> 
            ):(
                <>
                    <section className="flex flex-1 justify-center items-center flex-col py-10">
                        <Outlet />
                    </section>
                </>
        )}

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div style={{ marginBottom: '10px' }}> {/* Add margin to shift the logo from the exact center */}
                    <img src="/assets/images/Logo.png" alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />
                 </div>

                <Carousel style={{ width: '800px', height: '500px', margin: '60px' }}>
                <CarouselContent>
                    <CarouselItem>
                    <img
                        src="/assets/images/Ashesi.jpeg"
                        alt="logo"
                        width="800" 
                        height="500" 
                    />
                    </CarouselItem>
                    <CarouselItem>
                    <img
                        src="/assets/images/Ashesi.jpeg" 
                        alt="logo"
                        /> 
                    </CarouselItem>
                    <CarouselItem>
                        <img
                        src="/assets/images/Ashesi.jpeg" 
                        alt="logo"
                        /> 
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
                </div>

        </>
    )
}

export default AuthLayout