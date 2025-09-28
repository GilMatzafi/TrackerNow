import { useState, useRef, useEffect } from 'react';
import { JobCreate } from '../types/job';

interface UseJobFormProps {
  initialData?: Partial<JobCreate>;
  onSubmit: (jobData: JobCreate) => Promise<void>;
}

export function useJobForm({ initialData = {}, onSubmit }: UseJobFormProps) {
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
    company_logo: (initialData as any).company_logo || '',
    notes: initialData.notes || '',
    tags: initialData.tags || [],
    contacts: initialData.contacts || [],
    // Company details fields
    company_size: (initialData as any).company_size || '',
    founded: (initialData as any).founded || '',
    industry: (initialData as any).industry || '',
    website: (initialData as any).website || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [showReferralFields, setShowReferralFields] = useState(formData.is_referral);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [logoKey, setLogoKey] = useState(0);

  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);
  const companyLogoInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (field: keyof JobCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (file: File, type: 'resume' | 'coverLetter' | 'companyLogo') => {
    const fileName = file.name;
    if (type === 'resume') {
      setResumeFile(file);
      handleInputChange('cv', fileName);
    } else if (type === 'coverLetter') {
      setCoverLetterFile(file);
      handleInputChange('cover_letter', fileName);
    } else if (type === 'companyLogo') {
      setCompanyLogoFile(file);
      handleInputChange('company_logo', fileName);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const extractBasicInfoFromUrl = async (url: string) => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    let companyName = '';
    if (hostname.includes('linkedin.com')) {
      const pathParts = urlObj.pathname.split('/');
      const companyIndex = pathParts.findIndex(part => part === 'company');
      if (companyIndex !== -1 && pathParts[companyIndex + 1]) {
        companyName = pathParts[companyIndex + 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
    
    if (companyName) {
      handleInputChange('company', companyName);
    }
    
    handleInputChange('application_url', url);
    
    if (url.includes('linkedin.com')) {
      handleInputChange('completion_method', 'linkedin');
    } else if (url.includes('indeed.com')) {
      handleInputChange('completion_method', 'career_page');
    } else {
      handleInputChange('completion_method', 'other');
    }
  };

  const autoFillFromUrl = async (url: string) => {
    if (!url || !isValidUrl(url)) return;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Auto-filling from URL');
    }
    setIsAutoFilling(true);
    try {
      let jobId = null;
      
      const viewMatch = url.match(/\/jobs\/view\/(\d+)\//);
      if (viewMatch) {
        jobId = viewMatch[1];
      }
      
      if (!jobId) {
        const currentJobMatch = url.match(/currentJobId=(\d+)/);
        if (currentJobMatch) {
          jobId = currentJobMatch[1];
        }
      }
      
      if (!jobId) {
        const viewMatch2 = url.match(/\/jobs\/view\/(\d+)/);
        if (viewMatch2) {
          jobId = viewMatch2[1];
        }
      }
      
      // Try to extract job data from any URL using the backend API
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/extract-job-data' 
        : 'http://localhost:8000/api/extract-job-data';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, jobId })
      });
      
      if (response.ok) {
        const jobData = await response.json();
        const hasData = Object.values(jobData).some(value => value && value !== null);
        
        if (hasData) {
          // Update form data with extracted information
          Object.entries(jobData).forEach(([key, value]) => {
            if (key in formData && value) {
              handleInputChange(key as keyof JobCreate, value);
            }
          });
          
          // Handle company logo separately
          if (jobData.company_logo) {
            handleInputChange('company_logo', jobData.company_logo);
            setLogoKey(prev => prev + 1);
          }
          
          // Set completion method based on the extracted data
          if (jobData.completion_method) {
            handleInputChange('completion_method', jobData.completion_method);
          }
        } else {
          // Fall back to basic extraction if no data found
          await extractBasicInfoFromUrl(url);
          setErrors({ url: 'Could not extract job details from this URL. Please fill manually.' });
        }
      } else {
        // Fall back to basic extraction if API call fails
        await extractBasicInfoFromUrl(url);
        setErrors({ url: 'Could not connect to job extraction service. Please fill manually.' });
      }
    } catch (error) {
      console.error('Error auto-filling from URL:', error);
      setErrors({ url: 'Could not extract job details from this URL. Please fill manually.' });
    } finally {
      setIsAutoFilling(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSuccess(true);
      setTimeout(() => {
        // This will be handled by the parent component
      }, 1500);
    } catch (error) {
      console.error('Error submitting job application:', error);
      setErrors({ submit: 'Failed to save job application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    setShowReferralFields,
    setIsSuccess
  };
}
