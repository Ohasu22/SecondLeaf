import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Leaf, Menu, X, User, ShoppingBag, Package, LogOut } from "lucide-react";

export default function Navigation({ isLoggedIn = false, onLogin, onLogout }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location === path;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-elevate p-2 rounded-md">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground">SecondLeaf</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid="link-home"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                isActive('/shop') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid="link-shop"
            >
              Shop
            </Link>
            {isLoggedIn && (
              <Link 
                href="/sell" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                  isActive('/sell') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid="link-sell"
              >
                Sell
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link href="/account">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2" data-testid="button-account">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={onLogout} data-testid="button-logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={onLogin} data-testid="button-login">
                  Sign In
                </Button>
                <Link href="/signup">
                  <Button data-testid="button-signup">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover-elevate ${
                  isActive('/') ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-link-home"
              >
                <div className="flex items-center space-x-2">
                  <span>Home</span>
                </div>
              </Link>
              
              <Link 
                href="/shop" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover-elevate ${
                  isActive('/shop') ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-link-shop"
              >
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop</span>
                </div>
              </Link>

              {isLoggedIn && (
                <Link 
                  href="/sell" 
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover-elevate ${
                    isActive('/sell') ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-sell"
                >
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Sell</span>
                  </div>
                </Link>
              )}

              <div className="border-t border-border mt-3 pt-3">
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <Link 
                      href="/account" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hover-elevate"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-link-account"
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Account</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => {
                        onLogout?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hover-elevate"
                      data-testid="mobile-button-logout"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button 
                      onClick={() => {
                        onLogin?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hover-elevate"
                      data-testid="mobile-button-login"
                    >
                      Sign In
                    </button>
                    <Link 
                      href="/signup" 
                      className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid="mobile-link-signup"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}