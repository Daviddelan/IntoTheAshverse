// import { Link, NavLink, useLocation } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
// import { INavLink } from "@/types";
// import { sidebarLinks } from "@/constants";
// import { Button } from "@/components/ui/button";
// import { logout } from "@/lib/appwrite/api";
// // import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

// const LeftSidebar = () => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   const handleLogoOut = () => {
//     logout();
//     navigate('/');
//   }

//   return (
//     <nav className="leftsidebar flex flex-col items-start">
//       <div className="flex flex-col gap-11">
      
//         <ul className="flex flex-col gap-6">
//           {sidebarLinks.map((link: INavLink) => {
//             const isActive = pathname === link.route;

//             return (
//               <li
//                 key={link.label}
//                 className={`leftsidebar-link group ${
//                   isActive && "bg-primary-500"
//                 }`}
//               >
//                 <NavLink
//                   to={link.route}
//                   className="flex gap-4 items-center p-4"
//                 >
//                   <img
//                     src={link.imgURL}
//                     alt={link.label}
//                     className={`group-hover:invert-white ${
//                       isActive && "invert-white"
//                     }`}
//                   />
//                   {link.label}
//                 </NavLink>
//               </li>
//             );
//           })}
//         </ul>
//       </div>

//       <Button
//         variant="ghost"
//         className="shad-button_ghost"
//         onClick={handleLogoOut}
//       >
//         <img src="/assets/icons/logout.svg" alt="logout" />
//         <p className="small-medium lg:base-medium">Logout</p>
//       </Button>
//     </nav>
//   );
// };

// export default LeftSidebar;
import { Sidebar } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { logout } from "@/lib/appwrite/api";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "@/components/ui/button";

function LeftSidebar() {
  const navigate = useNavigate();

  const handleLogoOut = () => {
    logout();
    navigate('/');
  }

  return (
    <div className="fixed h-full left-0 top-0 flex justify-center items-center bg-white bg-opacity-70 shadow-lg w-40">

      <Sidebar aria-label="sidebar">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {sidebarLinks.map((link: INavLink) => (
              <Sidebar.Item href={link.route} key={link.label} icon={HiChartPie}>
                {link.label}
              </Sidebar.Item>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={handleLogoOut}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>
      </Sidebar>
    </div>
  );
}

export default LeftSidebar;
