
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { TestTube, Home, LogOut, User } from 'lucide-react';


const Navigation: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Gametriq
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              
              {currentUser && (
                <Link 
                  to="/testing" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === '/testing' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <TestTube className="h-4 w-4" />
                  MVP Testing
                  <Badge variant="outline" className="text-xs border-purple-400 text-purple-400">
                    Beta
                  </Badge>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-white font-medium">{currentUser.name || currentUser.email}</span>
                  <Badge 
                    variant={currentUser.role === 'Coach' ? 'default' : 'secondary'}
                    className={currentUser.role === 'Coach' ? 'bg-blue-600' : 'bg-green-600'}
                  >
                    {currentUser.role}
                  </Badge>
                </div>
                
                <Button 
                  onClick={logout}
                  variant="ghost" 
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="text-gray-300">
                Please log in to access features
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
