import React from "react";
import Sidebar from "../components/shared/Sidebar";
import MobileNav from "../components/shared/MobileNav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col md:hidden">
        {/* Mobile Nav always on top */}
        <MobileNav />

        {/* Content below mobile nav */}
        <div className="flex-1 w-full">
          <div className="max-w-6xl mx-auto p-4">{children}</div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:flex flex-1">
        <div className="max-w-6xl mx-auto p-4">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
