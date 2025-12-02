import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DonationForm } from './components/DonationForm';
import { MyDonations } from './components/MyDonations';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { User } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const storedUser = storageService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleSignUp = (newUser: User) => {
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'donate':
        return user ? (
          <DonationForm
            user={user}
            onSuccess={() => setCurrentPage('my-donations')}
          />
        ) : (
          <Login onLogin={handleLogin} onNavigateToSignUp={() => setCurrentPage('signup')} />
        );
      case 'my-donations':
        return user ? <MyDonations user={user} onNavigateToDonate={() => setCurrentPage('donate')} /> : <Login onLogin={handleLogin} onNavigateToSignUp={() => setCurrentPage('signup')} />
      case 'login':
        return <Login onLogin={handleLogin} onNavigateToSignUp={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignUp onSignUp={handleSignUp} onNavigateToLogin={() => setCurrentPage('login')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2024 UK-SL Relief Hub. Facilitating aid with transparency.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-slate-400 text-sm">
            <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
