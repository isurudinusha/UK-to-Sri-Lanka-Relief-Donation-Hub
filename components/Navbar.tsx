import React from 'react';
import { Package, LogOut, Menu, X, Globe, Heart } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const NavItem = ({ page, label, icon: Icon }: { page: string; label: string; icon?: any }) => (
    <button
      onClick={() => {
        onNavigate(page);
        setIsMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === page
        ? 'bg-emerald-700 text-white font-medium'
        : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
        }`}
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-full object-cover" />
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-emerald-300" />
              <span className="text-white font-bold text-xl hidden sm:block">UK → Sri Lanka Relief</span>
              <span className="text-white font-bold text-xl sm:hidden">Relief Hub</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem page="dashboard" label="Dashboard" icon={Globe} />
            {user ? (
              <>
                <NavItem page="donate" label="Donate Now" icon={Heart} />
                <NavItem page="my-donations" label="My Donations" icon={Package} />
                <div className="ml-4 flex items-center space-x-3 pl-4 border-l border-emerald-700">
                  <div className="flex flex-col items-end">
                    <span className="text-white text-sm font-medium">{user.name}</span>
                    <span className="text-emerald-300 text-xs">{user.email}</span>
                  </div>
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-emerald-500" />
                  <button
                    onClick={onLogout}
                    className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-full transition"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="ml-4 bg-white text-emerald-900 px-5 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-emerald-100 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-800 pb-4 px-2 pt-2">
          <div className="flex flex-col space-y-1">
            <NavItem page="dashboard" label="Public Dashboard" icon={Globe} />
            {user ? (
              <>
                <NavItem page="donate" label="Donate Items" icon={Heart} />
                <NavItem page="my-donations" label="My History" icon={Package} />
                <div className="border-t border-emerald-700 mt-2 pt-2 flex items-center justify-between px-4">
                  <div className="flex items-center space-x-2">
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                    <span className="text-white text-sm">{user.name}</span>
                  </div>
                  <button onClick={onLogout} className="text-emerald-200 text-sm">Logout</button>
                </div>
              </>
            ) : (
              <NavItem page="login" label="Sign In" />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
