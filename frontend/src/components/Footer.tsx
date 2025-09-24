
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-xl font-bold">SwapEat</span>
            </div>
            <p className="text-gray-400 text-sm">
              Building sustainable communities through food sharing. Reduce waste, connect neighbors, create impact.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Guidelines</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SwapEat. Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" /> for sustainable communities.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Reducing food waste, one swap at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};
