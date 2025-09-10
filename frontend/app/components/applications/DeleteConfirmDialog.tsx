'use client';

import React from 'react';
import { Application } from '@/app/types/application';

interface DeleteConfirmDialogProps {
  application: Application | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  application,
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen || !application) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div 
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <span className="text-xl" style={{ color: '#DC2626' }}>⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                Delete Application
              </h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                This action cannot be undone
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Are you sure you want to delete the application for{' '}
              <span className="font-medium" style={{ color: '#111827' }}>
                {application.job_title}
              </span>{' '}
              at{' '}
              <span className="font-medium" style={{ color: '#111827' }}>
                {application.company_name}
              </span>?
            </p>
            <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
              All associated interview stages and notes will be permanently removed.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                color: '#374151'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-white hover:bg-red-700 disabled:opacity-50 transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{ 
                backgroundColor: '#DC2626',
                border: '1px solid #DC2626'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B91C1C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
              }}
            >
              {isLoading ? 'Deleting...' : 'Delete Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
