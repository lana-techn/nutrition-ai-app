import Link from 'next/link';
import { Apple, Heart, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <Apple className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              <span className="text-lg sm:text-xl font-bold text-white">NutriAI</span>
            </Link>
            <p className="text-slate-400 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed max-w-xs">
              Your AI-powered nutrition assistant helping you make healthier choices every day.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.instagram.com/lana.dev_/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-green-400 transition-colors"
                aria-label="Instagram Lana"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="https://www.instagram.com/_fitri.ayu/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-green-400 transition-colors"
                aria-label="Instagram Fitri"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-green-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Features</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>
                <Link href="/analyze" className="hover:text-green-400 transition-colors inline-block">
                  AI Food Analysis
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-green-400 transition-colors inline-block">
                  AI Nutrition Coach
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-green-400 transition-colors inline-block">
                  Healthy Recipes
                </Link>
              </li>
              <li>
                <Link href="/meal-planner" className="hover:text-green-400 transition-colors inline-block">
                  Meal Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>
                <Link href="/blog" className="hover:text-green-400 transition-colors inline-block">
                  Nutrition Blog
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-green-400 transition-colors inline-block">
                  Personal Recommendations
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-green-400 transition-colors inline-block">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors inline-block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors inline-block">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 text-center sm:text-left">
          <p className="text-slate-400 text-xs sm:text-sm flex items-center justify-center sm:justify-start flex-wrap gap-1">
            <span>© 2025 NutriAI. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 sm:h-4 sm:w-4 inline text-red-400" /> for your health.
            </span>
          </p>
          <p className="text-slate-400 text-xs sm:text-sm">
            Powered by AI • Designed by Lana
          </p>
        </div>
      </div>
    </footer>
  );
}