"use client";

import { useEffect } from 'react';
import { Job } from '../../types/job';

// Import all the new section components
import JobHeaderSection from './sections/JobHeaderSection';
import CompanyOverviewSection from './sections/CompanyOverviewSection';
import JobDescriptionSection from './sections/JobDescriptionSection';
import SkillsSidebar from './sections/SkillsSidebar';
import ContactSection from './sections/ContactSection';
import DocumentsSection from './sections/DocumentsSection';
import ApplicationDetailsSection from './sections/ApplicationDetailsSection';

// Custom launch animation styles
const launchModalStyles = `
  @keyframes launchModal {
    0% {
      transform: scale(0.3) translateY(60px) rotateX(10deg);
      opacity: 0;
      filter: blur(2px);
    }
    20% {
      transform: scale(0.6) translateY(30px) rotateX(5deg);
      opacity: 0.4;
      filter: blur(1px);
    }
    40% {
      transform: scale(0.85) translateY(10px) rotateX(2deg);
      opacity: 0.7;
      filter: blur(0.5px);
    }
    60% {
      transform: scale(1.02) translateY(-3px) rotateX(-1deg);
      opacity: 0.9;
      filter: blur(0px);
    }
    80% {
      transform: scale(0.99) translateY(1px) rotateX(0.5deg);
      opacity: 1;
      filter: blur(0px);
    }
    100% {
      transform: scale(1) translateY(0) rotateX(0deg);
      opacity: 1;
      filter: blur(0px);
    }
  }
`;

interface JobDetailPageProps {
  job: Job;
  onClose: () => void;
  onEdit?: (job: Job) => void;
  isAddingNewJob?: boolean;
}

export default function JobDetailPage({ job, onClose, onEdit, isAddingNewJob = false }: JobDetailPageProps) {
  // Add launch animation styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          zIndex: 10000
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-lg font-medium"
            >
              ← Back to Applications
            </button>
            <div className="flex items-center space-x-4">
              {isAddingNewJob ? (
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Adding New Job
                </span>
              ) : (
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  job.status === 'applied' ? 'bg-green-100 text-green-800' :
                  job.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                  job.status === 'offered' ? 'bg-purple-100 text-purple-800' :
                  job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header */}
              <JobHeaderSection job={job} isAddingNewJob={isAddingNewJob} />

              {/* Company Overview */}
              <CompanyOverviewSection job={job} />

              {/* Job Description */}
              <JobDescriptionSection job={job} />
            </div>

            {/* Skills Sidebar */}
            <div className="space-y-6">
              <SkillsSidebar />
              <ContactSection job={job} />
              <DocumentsSection job={job} />
              <ApplicationDetailsSection job={job} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
