"use client";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  problemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({ 
  isOpen, 
  problemName, 
  onConfirm, 
  onCancel 
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div 
        className="rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB'
        }}
      >
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#DC2626' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#111827' }}>
            Delete Problem
          </h3>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            Are you sure you want to delete <strong style={{ color: '#111827' }}>"{problemName}"</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg transition-colors cursor-pointer"
              style={{ 
                backgroundColor: '#FFFFFF',
                color: '#374151',
                border: '1px solid #D1D5DB'
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
              className="px-4 py-2 rounded-lg transition-colors cursor-pointer"
              style={{ 
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: '1px solid #DC2626'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B91C1C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
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
