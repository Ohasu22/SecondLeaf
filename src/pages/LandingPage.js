import { useState } from "react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import HeroSection from "../components/HeroSection";
import { Recycle, Users, Leaf, ArrowRight, CheckCircle, TreePine } from "lucide-react";

export default function LandingPage({ onNavigateToShop, onNavigateToSignup }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        onExploreShop={onNavigateToShop}
        onSignUp={onNavigateToSignup}
      />

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-r from-accent/30 via-accent/50 to-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How SecondLeaf Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our eco-friendly marketplace in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover-elevate bg-card/80 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
              <CardContent className="p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Join Our Community</h3>
                <p className="text-muted-foreground">
                  Sign up for free and become part of our sustainable marketplace community
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate bg-card/80 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
              <CardContent className="p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Buy or Sell</h3>
                <p className="text-muted-foreground">
                  List your unused items or browse quality pre-owned products from others
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate bg-card/80 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
              <CardContent className="p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Save the Planet</h3>
                <p className="text-muted-foreground">
                  Track your environmental impact and see how much CO₂ you've saved
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Every Purchase Makes a Difference
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                When you buy second-hand, you're not just saving money — you're helping save the planet. 
                Every product given a second life prevents waste and reduces CO₂ emissions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Reduce manufacturing waste by 80%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Save up to 70% compared to buying new</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg">Track your personal environmental impact</span>
                </div>
              </div>

              <Link href="/shop">
                <Button size="lg" className="group" data-testid="button-start-browsing">
                  Start Browsing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 text-center backdrop-blur-sm border border-primary/20">
                <TreePine className="h-24 w-24 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Track Your Impact
                </h3>
                <p className="text-muted-foreground mb-6">
                  See exactly how much CO₂ you've saved with every purchase
                </p>
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                  <div className="text-3xl font-bold text-primary">89.5 tons</div>
                  <div className="text-sm text-muted-foreground">CO₂ saved by our community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/20 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Give Things a Second Leaf?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are making a difference one purchase at a time. 
            Start your sustainable shopping journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" data-testid="button-get-started">
                Get Started Now
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg" data-testid="button-browse-products">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}