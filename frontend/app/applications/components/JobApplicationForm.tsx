"use client";

import { useEffect } from 'react';
import { XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { JobCreate } from '../../types/job';
import { useJobForm } from '../../hooks/useJobForm';

// Import all the new section components
import BasicInformationSection from './sections/BasicInformationSection';
import CompanyOverviewSectionForm from './sections/CompanyOverviewSectionForm';
import JobDescriptionSectionForm from './sections/JobDescriptionSectionForm';
import ReferralSection from './sections/ReferralSection';
import ApplicationCompletionSection from './sections/ApplicationCompletionSection';
import DocumentsSectionForm from './sections/DocumentsSectionForm';
import NotesSection from './sections/NotesSection';
import FormActions from './sections/FormActions';

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

interface JobApplicationFormProps {
  onClose: () => void;
  onSubmit: (jobData: JobCreate) => Promise<void>;
  initialData?: Partial<JobCreate>;
  isEditing?: boolean;
}

export default function JobApplicationForm({ 
  onClose, 
  onSubmit, 
  initialData = {},
  isEditing = false 
}: JobApplicationFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    resumeFile,
    coverLetterFile,
    companyLogoFile,
    showReferralFields,
    isAutoFilling,
    logoKey,
    resumeInputRef,
    coverLetterInputRef,
    companyLogoInputRef,
    handleInputChange,
    handleFileUpload,
    handleSubmit,
    autoFillFromUrl,
    isValidUrl,
    setShowReferralFields
  } = useJobForm({ initialData, onSubmit });

  // Add launch animation styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle success and close modal
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [isSuccess, onClose]);

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl mx-4 max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          zIndex: 10000,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
                </h2>
                <p className="text-lg text-gray-600 mt-1">
                  {isEditing ? 'Update your job application details' : 'Fill in the details for your new job application'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-105"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Basic Information */}
          <BasicInformationSection 
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Company Overview */}
          <CompanyOverviewSectionForm 
            formData={formData}
            companyLogoFile={companyLogoFile}
            logoKey={logoKey}
            companyLogoInputRef={companyLogoInputRef}
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
          />

          {/* Job Description */}
          <JobDescriptionSectionForm 
            formData={formData}
            handleInputChange={handleInputChange}
          />

          {/* Referral Information */}
          <ReferralSection 
            formData={formData}
            errors={errors}
            showReferralFields={showReferralFields}
            handleInputChange={handleInputChange}
            setShowReferralFields={setShowReferralFields}
          />

          {/* Application Completion */}
          <ApplicationCompletionSection 
            formData={formData}
            errors={errors}
            isAutoFilling={isAutoFilling}
            handleInputChange={handleInputChange}
            autoFillFromUrl={autoFillFromUrl}
            isValidUrl={isValidUrl}
          />

          {/* File Uploads */}
          <DocumentsSectionForm 
            resumeFile={resumeFile}
            coverLetterFile={coverLetterFile}
            resumeInputRef={resumeInputRef}
            coverLetterInputRef={coverLetterInputRef}
            handleFileUpload={handleFileUpload}
          />

          {/* Additional Notes */}
          <NotesSection 
            formData={formData}
            handleInputChange={handleInputChange}
          />

          {/* Form Actions */}
          <FormActions 
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            errors={errors}
            isEditing={isEditing}
            onClose={onClose}
            onSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}
