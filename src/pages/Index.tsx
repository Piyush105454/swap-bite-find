
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Leaf, Zap, ArrowRight, Heart, Star, Camera } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-orange-400/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            🌱 Join the food sharing revolution
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            SwapEat
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Share fresh food with your neighbors. Reduce waste, build community, and discover amazing local treats.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                Start Sharing
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-full">
              Learn More
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Find Nearby</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Discover fresh food shared by neighbors in your area</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Recognition</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Smart food identification and freshness detection</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Build Community</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Connect with neighbors and create lasting relationships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why SwapEat?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              More than just food sharing - it's about building sustainable communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <Leaf className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reduce Waste</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Help prevent food waste by sharing excess with neighbors</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Build Community</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Connect with neighbors and strengthen local bonds</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <Zap className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Matching</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">AI-powered recommendations for perfect food matches</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Heart className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Feel Good</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Make a positive impact on your environment and community</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">2.5K+</div>
              <div className="text-gray-600 dark:text-gray-300">Food Items Shared</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600">1.2K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">85%</div>
              <div className="text-gray-600 dark:text-gray-300">Waste Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Start Sharing?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of neighbors who are already making a difference
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
