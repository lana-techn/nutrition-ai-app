import Link from 'next/link';
import { Apple, Heart, Mail, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Apple className="h-6 w-6 text-green-400" />
              <span className="text-xl font-bold text-white">NutriAI</span>
            </Link>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Your AI-powered nutrition assistant helping you make healthier choices every day.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/analyze" className="hover:text-green-400 transition-colors">
                  AI Food Analysis
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-green-400 transition-colors">
                  AI Nutrition Coach
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-green-400 transition-colors">
                  Healthy Recipes
                </Link>
              </li>
              <li>
                <Link href="/meal-planner" className="hover:text-green-400 transition-colors">
                  Meal Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="hover:text-green-400 transition-colors">
                  Nutrition Blog
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-green-400 transition-colors">
                  Personal Recommendations
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 NutriAI. All rights reserved. Made with{" "}
            <Heart className="h-4 w-4 inline text-red-400" /> for your health.
          </p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0">
            Powered by AI • Designed for Wellness
          </p>
        </div>
      </div>
    </footer>
  );
}