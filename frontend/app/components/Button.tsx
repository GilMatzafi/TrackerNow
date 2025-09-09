"use client";

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseClasses = "w-full px-10 py-5 text-white font-semibold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer active:scale-95 shadow-lg hover:shadow-xl";
  
  if (variant === 'primary') {
    return (
      <button 
        type={type}
        className={`${baseClasses} ${className}`}
        style={{
          backgroundColor: '#936DFF',
          boxShadow: '0 4px 15px rgba(147, 109, 255, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(147, 109, 255, 0.9)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(147, 109, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#936DFF';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(147, 109, 255, 0.3)';
        }}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <button 
      type={type}
      className={`${baseClasses} bg-transparent border-2 ${className}`}
      style={{
        borderColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.1)';
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
