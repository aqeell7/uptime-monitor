import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, Activity } from 'lucide-react';

const Navbar = ({ isLanding = false }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-gray-200/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-terracotta" />
            <Link to={user ? "/dashboard" : "/"} className="ml-2 text-xl font-serif font-bold tracking-tight text-charcoal hover:text-terracotta transition-colors">
              UptimeCheck
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-600 hidden sm:block">Welcome, <span className="text-charcoal">{user.name}</span></span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Sign out
                </button>
              </>
            ) : isLanding ? (
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-charcoal transition-colors">
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;