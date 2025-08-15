import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, PencilLine, User, LogOut, List } from "lucide-react";
import { removeToken } from "@/utils/auth";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { to: "/", label: "Home", icon: <Home size={20} /> },
  { to: "/posts", label: "Posts", icon: <List size={20} /> },
  { to: "/create", label: "Create", icon: <PencilLine size={20} /> },
  { to: "/profile", label: "Profile", icon: <User size={20} /> },
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();

  const navigate = useNavigate()
  const handleLogout = () => {
    removeToken()
    navigate('/login')
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`
          fixed top-0 left-0 z-20 h-full bg-white/5 backdrop-blur-md border-r border-white/10 shadow-lg text-white p-4
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"}  py-3`}>
          <h1
            className={`text-xl font-bold text-purple-400 tracking-widest transition-all ${
              isOpen ? "block" : "hidden"
            }`}
          >
            BlogVerse
          </h1>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none lg:block"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
            )}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="space-y-4 pt-10">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar(); // Auto close on mobile
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === to
                  ? "bg-gradient-to-r from-purple-600 to-blue-500"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              {icon}
              <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-4 right-4 flex items-center justify-center gap-2 py-2 px-4 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all duration-300 ease-in-out text-sm"
          aria-label="Logout"
        >
          <LogOut size={18} />
          <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
        </button>
      </div>
    </>
  );
}
