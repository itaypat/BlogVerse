import React, { useState } from "react";
import Sidebar from "./SideBar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* TopBar for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between bg-black/70 backdrop-blur-md z-10 border-b border-white/10">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold tracking-wider text-purple-400">
          BlogVerse
        </h1>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Main content */}
      <main
        className={`flex-1 p-5 transition-all duration-300 ease-in-out mt-14 lg:mt-0 ${
          isSidebarOpen && window.innerWidth >= 1024 ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {children}
        <Footer/>
      </main>

    </div>
  );
}
