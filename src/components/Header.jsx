import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Menu } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-soft">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hover:from-primary-700 hover:to-primary-900 transition-all duration-300">
            My Portfolio
          </Link>
          <div className="flex gap-3 md:gap-6 items-center text-sm md:text-base">
            <Link to="/projects" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium">
              Projects
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium">
              Blog
            </Link>
            <Link to="/contact" className="hidden sm:block text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium">
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium">
                  Admin
                </Link>
                <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hidden md:inline-flex items-center gap-2 font-medium">
                  <User size={16} />
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
