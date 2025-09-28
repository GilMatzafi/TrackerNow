import React from 'react';
import { BuildingOfficeIcon, UsersIcon, CalendarDaysIcon, BriefcaseIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { JobCreate } from '../../../types/job';

interface CompanyOverviewSectionFormProps {
  formData: JobCreate;
  companyLogoFile: File | null;
  logoKey: number;
  companyLogoInputRef: React.RefObject<HTMLInputElement | null>;
  handleInputChange: (field: keyof JobCreate, value: any) => void;
  handleFileUpload: (file: File, type: 'companyLogo') => void;
}

export default function CompanyOverviewSectionForm({ 
  formData, 
  companyLogoFile,
  logoKey,
  companyLogoInputRef,
  handleInputChange,
  handleFileUpload
}: CompanyOverviewSectionFormProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-3xl font-semibold text-gray-900 flex items-center mb-8">
        <div className="p-2 bg-green-100 rounded-lg mr-4">
          <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
        </div>
        Company Overview
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Section */}
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-6">About {formData.company || 'Company'}</h4>
          
          {/* Company Logo Upload */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Company Logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref={companyLogoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'companyLogo')}
                className="hidden"
              />
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {(companyLogoFile || formData.company_logo) ? (
                    <img 
                      key={logoKey}
                      src={companyLogoFile ? URL.createObjectURL(companyLogoFile) : formData.company_logo} 
                      alt="Company logo" 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const icon = e.currentTarget.nextElementSibling as HTMLElement;
                        if (icon) icon.style.display = 'block';
                      }}
                      onLoad={() => {
                        // Logo loaded successfully
                      }}
                    />
                  ) : null}
                  <BuildingOfficeIcon 
                    className={`w-8 h-8 text-gray-400 ${(companyLogoFile || formData.company_logo) ? 'hidden' : 'flex'}`} 
                  />
                </div>
                <div className="text-lg text-gray-600">
                  <button
                    type="button"
                    onClick={() => companyLogoInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    {companyLogoFile ? 'Change logo' : 'Upload logo'}
                  </button>
                  <span className="ml-1">or drag and drop</span>
                </div>
                <p className="text-sm text-gray-500">PNG, JPG, SVG up to 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Company Description
            </label>
            <textarea
              value={formData.company_description || ''}
              onChange={(e) => handleInputChange('company_description', e.target.value)}
              rows={6}
              className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description about the company..."
            />
          </div>
        </div>
        
        {/* Company Details Section */}
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-6">Company Details</h4>
          <div className="space-y-5">
            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-3">
                <UsersIcon className="w-5 h-5 mr-2 text-gray-500" />
                Company Size
              </label>
              <input
                type="text"
                value={formData.company_size || ''}
                onChange={(e) => handleInputChange('company_size', e.target.value)}
                className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 500-1000 employees"
              />
            </div>
            
            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-3">
                <CalendarDaysIcon className="w-5 h-5 mr-2 text-gray-500" />
                Founded
              </label>
              <input
                type="text"
                value={formData.founded || ''}
                onChange={(e) => handleInputChange('founded', e.target.value)}
                className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2010"
              />
            </div>
            
            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-3">
                <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-500" />
                Industry
              </label>
              <input
                type="text"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Technology"
              />
            </div>
            
            <div>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-3">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-gray-500" />
                Website
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-5 py-4 text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., www.company.com"
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
