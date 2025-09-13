import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Leaf, ArrowRight } from "lucide-react";
import heroImage from "../assets/background.png";

function Counter({ end, label, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = end / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary-foreground">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm md:text-base text-primary-foreground/80 mt-1">
        {label}
      </div>
    </div>
  );
}

export default function HeroSection({ onExploreShop, onSignUp }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Sustainable marketplace hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Hero Text */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/20 backdrop-blur-sm rounded-full p-4 border border-primary/30">
                <Leaf className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Give Things a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Second Leaf
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join India's most trusted marketplace for pre-owned goods. 
              Buy sustainably, sell easily, and track your environmental impact with every transaction.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 border border-primary/50 backdrop-blur-sm"
              onClick={onExploreShop}
              data-testid="button-explore-shop"
            >
              Explore Marketplace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
              onClick={onSignUp}
              data-testid="button-get-started"
            >
              Start Selling Today
            </Button>
          </div>

          {/* Impact Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Counter end={15000} label="Products Sold" suffix="+" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Counter end={89} label="Tons CO₂ Saved" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Counter end={5000} label="Happy Users" suffix="+" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}