"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon,
  DocumentArrowUpIcon,
  LinkIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { JobCreate, ContactCreate } from '../../types/job';

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
  const [formData, setFormData] = useState<JobCreate>({
    company: initialData.company || '',
    position: initialData.position || '',
    location: initialData.location || '',
    salary: initialData.salary || '',
    company_description: initialData.company_description || '',
    position_description: initialData.position_description || '',
    is_referral: initialData.is_referral || false,
    referrer_name: initialData.referrer_name || '',
    application_url: initialData.application_url || '',
    completion_method: initialData.completion_method || '',
    status: initialData.status || 'saved',
    applied_date: initialData.applied_date || new Date().toISOString().split('T')[0],
    cv: initialData.cv || '',
    cover_letter: initialData.cover_letter || '',
    notes: initialData.notes || '',
    tags: initialData.tags || [],
    contacts: initialData.contacts || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [showReferralFields, setShowReferralFields] = useState(formData.is_referral);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  // Add launch animation styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleInputChange = (field: keyof JobCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (file: File, type: 'resume' | 'coverLetter') => {
    // In a real app, you'd upload to a file service and get a URL
    // For now, we'll just store the file name
    const fileName = file.name;
    if (type === 'resume') {
      setResumeFile(file);
      handleInputChange('cv', fileName);
    } else {
      setCoverLetterFile(file);
      handleInputChange('cover_letter', fileName);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Job position is required';
    }
    if (formData.is_referral && !formData.referrer_name?.trim()) {
      newErrors.referrer_name = 'Referrer name is required when referral is selected';
    }
    if (formData.application_url && !isValidUrl(formData.application_url)) {
      newErrors.application_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSuccess(true);
      // Show success message briefly before closing
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting job application:', error);
      setErrors({ submit: 'Failed to save job application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completionMethods = [
    { value: 'linkedin', label: 'LinkedIn Easy Apply' },
    { value: 'career_page', label: 'Company Career Page' },
    { value: 'email', label: 'Email Application' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          zIndex: 10000
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-900">
              {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-900 flex items-center">
              <BuildingOfficeIcon className="w-6 h-6 mr-3" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-5 py-4 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Google, Microsoft, Apple"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.company}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Job Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`w-full px-5 py-4 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Software Engineer, Product Manager"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.position}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Salary
                </label>
                <input
                  type="text"
                  value={formData.salary || ''}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $80,000 - $100,000"
                />
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-900">Company Overview</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                value={formData.company_description || ''}
                onChange={(e) => handleInputChange('company_description', e.target.value)}
                rows={4}
                className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description about the company..."
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-900">Job Description</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Description
              </label>
              <textarea
                value={formData.position_description || ''}
                onChange={(e) => handleInputChange('position_description', e.target.value)}
                rows={6}
                className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Job requirements, responsibilities, and details..."
              />
            </div>
          </div>

          {/* Referral Information */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-900 flex items-center">
              <UserIcon className="w-6 h-6 mr-3" />
              Referral Information
            </h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_referral"
                checked={formData.is_referral}
                onChange={(e) => {
                  handleInputChange('is_referral', e.target.checked);
                  setShowReferralFields(e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_referral" className="text-lg font-medium text-gray-700">
                This application is through a referral
              </label>
            </div>

            {showReferralFields && (
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Referrer Name *
                </label>
                <input
                  type="text"
                  value={formData.referrer_name || ''}
                  onChange={(e) => handleInputChange('referrer_name', e.target.value)}
                  className={`w-full px-5 py-4 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.referrer_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Name of the person who referred you"
                />
                {errors.referrer_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.referrer_name}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Application Completion */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-900 flex items-center">
              <LinkIcon className="w-6 h-6 mr-3" />
              Application Completion
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Application URL
                </label>
                <input
                  type="url"
                  value={formData.application_url || ''}
                  onChange={(e) => handleInputChange('application_url', e.target.value)}
                  className={`w-full px-5 py-4 text-lg text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.application_url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://linkedin.com/jobs/view/... or company career page"
                />
                {errors.application_url && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.application_url}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Completion Method
                </label>
                <select
                  value={formData.completion_method || ''}
                  onChange={(e) => handleInputChange('completion_method', e.target.value)}
                  className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select method</option>
                  {completionMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-900 flex items-center">
              <DocumentArrowUpIcon className="w-6 h-6 mr-3" />
              Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Resume/CV
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resume')}
                    className="hidden"
                  />
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-lg text-gray-600">
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Upload resume
                    </button>
                    <span className="ml-1">or drag and drop</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
                  {resumeFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Cover Letter
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={coverLetterInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'coverLetter')}
                    className="hidden"
                  />
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-lg text-gray-600">
                    <button
                      type="button"
                      onClick={() => coverLetterInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Upload cover letter
                    </button>
                    <span className="ml-1">or drag and drop</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
                  {coverLetterFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      {coverLetterFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-900">Additional Notes</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes about this application..."
              />
            </div>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-lg text-green-600 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Job application saved successfully!
              </p>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-lg text-red-600 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center text-lg font-medium"
            >
              <XCircleIcon className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`px-8 py-4 rounded-lg transition-colors flex items-center text-lg font-medium ${
                isSuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-gray-900 hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSuccess ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Saved!
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  {isEditing ? 'Update Application' : 'Save Application'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
