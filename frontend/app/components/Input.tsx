"use client";

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-white text-lg font-medium mb-3">
        {label}
      </label>
      <input
        className={`w-full px-5 py-4 bg-white/10 border border-white/20 rounded-lg text-white text-lg placeholder-white/50 focus:outline-none focus:border-primary focus:bg-white/15 transition-all duration-300 ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-base mt-2">{error}</p>
      )}
    </div>
  );
}
