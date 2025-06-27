
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const Layout = () => {
  const { user, isDarkMode } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Projects & Invoices', href: '/projects-invoices', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Mobile Header */}
      <div className="md:hidden">
        <header className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 backdrop-blur-md shadow-lg ${
          isDarkMode 
            ? 'bg-gray-900/95 border-b border-gray-700' 
            : 'bg-white/95 border-b border-gray-100'
        }`}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 transform ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white shadow-lg hover:shadow-xl' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          <Logo size="md" />
          
          <div className="w-12"></div> {/* Spacer for balance */}
        </header>
        
        {/* Content spacer */}
        <div className="h-16"></div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-40">
        <div className={`flex flex-col flex-grow backdrop-blur-xl shadow-2xl transform-3d ${
          isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-100'
        } border-r`}>
          {/* Logo */}
          <div className="flex items-center px-8 py-6 border-b border-gray-100 dark:border-gray-700">
            <Logo size="lg" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-blue-500/25'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-xl'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="h-5 w-5 mr-4 group-hover:scale-110 transition-transform duration-200" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          <div className={`px-6 py-6 border-t border-gray-100 dark:border-gray-700`}>
            <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.name || 'User'}
                </p>
                <p className={`text-xs truncate ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-out animate-slide-in-left md:hidden ${
            isDarkMode ? 'bg-gray-900/98 border-gray-700' : 'bg-white/98 border-gray-100'
          } border-r shadow-2xl backdrop-blur-xl`}>
            <div className="flex flex-col h-full pt-16">
              {/* Navigation */}
              <nav className="flex-1 px-6 py-8 space-y-2">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 group ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-blue-500/25'
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:shadow-xl'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:shadow-lg'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="h-5 w-5 mr-4 group-hover:scale-110 transition-transform duration-200" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>

              {/* User info */}
              <div className={`px-6 py-6 border-t border-gray-100 dark:border-gray-700`}>
                <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
                    <span className="text-white font-bold text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user?.name || 'User'}
                    </p>
                    <p className={`text-xs truncate ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="md:pl-72">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
