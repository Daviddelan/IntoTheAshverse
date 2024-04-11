import { Link } from 'react-router-dom';
import { Button } from '../ui/button'
import { logout, fetchCurrentUserData } from '@/lib/appwrite/api';
import { useNavigate } from 'react-router-dom';
// import { getCurrentUser } from '@/lib/appwrite/api';
// import { useEffect, useState } from 'react';

const currentUserDetails = await fetchCurrentUserData();

const Topbar = () => {

  const navigate = useNavigate();

  const handleLogoOut = () => {
    logout();
    navigate('/signin');
  }

  return (
    <section className = "topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex-between py-4 px-5">
          <img
            src="/assets/images/Ashesi.jpeg"
            alt="logo"
            width={130}
            height={100}
          />
        </Link>

        <div className="flex gap-5">
          <Button variant="ghost" className="shad-button_ghost"
          onClick={handleLogoOut}>
            <img src="/assets/icons/logout.svg" alt="logout" width={20} height={20} />
          </Button>
            <Link to = {'/profile/${user.id}'}  className="flex-center gap-3">
              <img src={currentUserDetails?.imageUrl || "/assets/images/Ashesi.jpeg"}
              alt = "profile"
              className='h-8 w-8 rounded-full'/> 
            </Link>
        </div>
      </div>
    </section>
  );
}
export default Topbar;              