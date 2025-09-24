"use client";

import { useEffect } from 'react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  problemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Launch modal animation styles
const launchModalStyles = `
  @keyframes launchModal {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .launchModal {
    animation: launchModal 0.3s ease-out forwards;
  }
`;

export default function DeleteConfirmDialog({ 
  isOpen, 
  problemName, 
  onConfirm, 
  onCancel 
}: DeleteConfirmDialogProps) {
  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div 
        className="launchModal rounded-2xl p-12 w-[600px] max-h-[95vh] overflow-y-auto shadow-2xl"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          zIndex: 10000
        }}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onCancel}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
            style={{ color: '#6B7280' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-center">
          {/* Warning Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#DC2626' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mb-6" style={{ color: '#111827' }}>
            Delete Problem
          </h3>
          <p className="text-xl mb-12 leading-relaxed" style={{ color: '#6B7280' }}>
            Are you sure you want to delete <strong style={{ color: '#111827' }}>"{problemName}"</strong>? 
            <br />
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-6 justify-center">
            <button
              onClick={onCancel}
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 cursor-pointer"
              style={{ 
                backgroundColor: '#FFFFFF',
                color: '#374151',
                border: '2px solid #D1D5DB'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 cursor-pointer"
              style={{ 
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: '2px solid #DC2626'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B91C1C';
                e.currentTarget.style.borderColor = '#B91C1C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
                e.currentTarget.style.borderColor = '#DC2626';
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
