
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Menu, MessageCircle, User, MapPin, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                SwapEat
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === '/dashboard' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'text-gray-600 hover:text-green-600 dark:text-gray-300'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/messages" 
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === '/messages' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'text-gray-600 hover:text-green-600 dark:text-gray-300'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Messages</span>
                    <Badge className="bg-orange-500 text-white text-xs">3</Badge>
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === '/profile' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'text-gray-600 hover:text-green-600 dark:text-gray-300'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/#how-it-works" className="text-gray-600 hover:text-green-600 dark:text-gray-300 transition-colors">
                    How it Works
                  </Link>
                  <Link to="/#features" className="text-gray-600 hover:text-green-600 dark:text-gray-300 transition-colors">
                    Features
                  </Link>
                  <Link to="/#community" className="text-gray-600 hover:text-green-600 dark:text-gray-300 transition-colors">
                    Community
                  </Link>
                </>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2">
                    <img 
                      src={user?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`} 
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="hidden sm:flex">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
                    Login
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 text-white" onClick={() => setShowAuthModal(true)}>
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Dropdown */}
              <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/dashboard" 
                          className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={closeMobileMenu}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/messages" 
                          className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={closeMobileMenu}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Messages
                          <Badge className="bg-orange-500 text-white text-xs ml-auto">3</Badge>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/profile" 
                          className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={closeMobileMenu}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/#how-it-works" 
                          className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={closeMobileMenu}
                        >
                          How it Works
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/#features" 
                          className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={closeMobileMenu}
                        >
                          Features
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/#community" 
                          className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={closeMobileMenu}
                        >
                          Community
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setShowAuthModal(true);
                          closeMobileMenu();
                        }}
                      >
                        Login / Sign Up
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};
