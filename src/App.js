import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ShopPage from "./pages/ShopPage";
import SellPage from "./pages/SellPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/not-found";

function Router() {
  const [, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check login status on app load - todo: remove mock functionality
  useEffect(() => {
    const user = localStorage.getItem('secondleaf_current_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLocation('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('secondleaf_current_user');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setLocation('/');
    console.log('User logged out');
  };

  const handleLoginSuccess = () => {
    const user = localStorage.getItem('secondleaf_current_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
      setLocation('/shop');
    }
  };

  const handleSignupSuccess = () => {
    const user = localStorage.getItem('secondleaf_current_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
      setLocation('/shop');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation 
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={() => 
            <LandingPage 
              onNavigateToShop={() => setLocation('/shop')}
              onNavigateToSignup={() => setLocation('/signup')}
            />
          } />
          
          <Route path="/signup" component={() => 
            <SignupPage onSuccess={handleSignupSuccess} />
          } />
          
          <Route path="/login" component={() => 
            <LoginPage onSuccess={handleLoginSuccess} />
          } />
          
          <Route path="/shop" component={() => 
            <ShopPage 
              onRequestItem={(product) => {
                console.log('Requesting item:', product.name);
                if (!isLoggedIn) {
                  setLocation('/login');
                }
              }}
            />
          } />
          
          {isLoggedIn && (
            <>
              <Route path="/sell" component={() => <SellPage />} />
              <Route path="/account" component={() => 
                <AccountPage onLogout={handleLogout} />
              } />
            </>
          )}
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;