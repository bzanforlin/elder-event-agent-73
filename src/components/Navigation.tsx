
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Heart, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/elders', label: 'Elders', icon: Users },
    { path: '/events', label: 'Events', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      {/* Desktop Navigation */}
      <Card className="hidden md:block fixed top-6 left-6 right-6 z-50 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">CareEvents</h1>
              <p className="text-xs text-gray-600">Assisted Living Event Planning</p>
            </div>
          </Link>

          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Mobile Navigation */}
      <Card className="md:hidden fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">CareEvents</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive(item.path)
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </Card>

      {/* Spacer for fixed navigation */}
      <div className="h-20 md:h-24"></div>
    </>
  );
};

export default Navigation;
