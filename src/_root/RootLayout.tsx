import { Outlet } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/Leftbar";

const RootLayout = () => {
  return (
    <div className="w-full">
      <Topbar />
      <div className="flex flex-row">
        <LeftSidebar />

        <section className="w-full">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default RootLayout;
