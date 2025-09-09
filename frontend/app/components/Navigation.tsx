"use client";

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          TrackerNow
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-white/80 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-white/80 hover:text-white transition-colors">
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/auth/login"
            className="text-white/80 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/auth/signup"
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
