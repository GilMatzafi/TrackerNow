'use client';

import React, { useState, useEffect } from 'react';
import { Application, ApplicationFormData, ApplicationStatus, ApplicationSource, InterviewStage, InterviewStageDetail } from '@/app/types/application';

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (data: ApplicationFormData) => void;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    job_title: '',
    company_name: '',
    role_position: '',
    industry: '',
    location: '',
    application_status: 'DRAFT',
    application_date: '',
    job_link: '',
    notes: '',
    submitted_resume: false,
    contact_person_name: '',
    contact_person_email: '',
    application_source: undefined,
    source_details: '',
    interview_stages: []
  });

  const [newStage, setNewStage] = useState<InterviewStageDetail>({
    stage: 'Phone Screening',
    date: '',
    notes: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    if (application) {
      setFormData({
        job_title: application.job_title,
        company_name: application.company_name,
        role_position: application.role_position || '',
        industry: application.industry || '',
        location: application.location || '',
        application_status: application.application_status,
        application_date: application.application_date || '',
        job_link: application.job_link || '',
        notes: application.notes || '',
        submitted_resume: application.submitted_resume,
        contact_person_name: application.contact_person_name || '',
        contact_person_email: application.contact_person_email || '',
        application_source: application.application_source,
        source_details: application.source_details || '',
        interview_stages: application.interview_stages
      });
    }
  }, [application]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddStage = () => {
    if (newStage.stage && newStage.status) {
      setFormData(prev => ({
        ...prev,
        interview_stages: [...prev.interview_stages, { ...newStage }]
      }));
      setNewStage({
        stage: 'Phone Screening',
        date: '',
        notes: '',
        status: 'Scheduled'
      });
    }
  };

  const handleRemoveStage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interview_stages: prev.interview_stages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    const colors = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'APPLIED': 'bg-blue-100 text-blue-800',
      'UNDER_REVIEW': 'bg-yellow-100 text-yellow-800',
      'PHONE_SCREENING': 'bg-purple-100 text-purple-800',
      'TECHNICAL_INTERVIEW': 'bg-orange-100 text-orange-800',
      'HR_INTERVIEW': 'bg-green-100 text-green-800',
      'FINAL_INTERVIEW': 'bg-indigo-100 text-indigo-800',
      'OFFER_RECEIVED': 'bg-emerald-100 text-emerald-800',
      'OFFER_ACCEPTED': 'bg-green-100 text-green-800',
      'OFFER_DECLINED': 'bg-red-100 text-red-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'WITHDRAWN': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-scale-in">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>
        {application ? 'Edit Application' : 'Add New Application'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Job Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Job Title *
            </label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Role/Position
            </label>
            <input
              type="text"
              name="role_position"
              value={formData.role_position}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Application Status
            </label>
            <select
              name="application_status"
              value={formData.application_status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="DRAFT">Draft</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PHONE_SCREENING">Phone Screening</option>
              <option value="TECHNICAL_INTERVIEW">Technical Interview</option>
              <option value="HR_INTERVIEW">HR Interview</option>
              <option value="FINAL_INTERVIEW">Final Interview</option>
              <option value="OFFER_RECEIVED">Offer Received</option>
              <option value="OFFER_ACCEPTED">Offer Accepted</option>
              <option value="OFFER_DECLINED">Offer Declined</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Application Date
            </label>
            <input
              type="datetime-local"
              name="application_date"
              value={formData.application_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Job Link
            </label>
            <input
              type="url"
              name="job_link"
              value={formData.job_link}
              onChange={handleInputChange}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Contact Person Name
            </label>
            <input
              type="text"
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Contact Person Email
            </label>
            <input
              type="email"
              name="contact_person_email"
              value={formData.contact_person_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        {/* Application Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Application Source
            </label>
            <select
              name="application_source"
              value={formData.application_source || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            >
              <option value="">Select Source</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="COMPANY_WEBSITE">Company Website</option>
              <option value="REFERRAL">Referral</option>
              <option value="JOB_BOARD">Job Board</option>
              <option value="RECRUITER">Recruiter</option>
              <option value="NETWORKING">Networking</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Source Details
            </label>
            <input
              type="text"
              name="source_details"
              value={formData.source_details}
              onChange={handleInputChange}
              placeholder="Additional details about how you found this job"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        {/* Resume Submission */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="submitted_resume"
            checked={formData.submitted_resume}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium" style={{ color: '#374151' }}>
            Submitted Resume/CV
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            placeholder="Additional notes about this application..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
            style={{ color: '#111827' }}
          />
        </div>

        {/* Interview Stages */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
            Interview Stages
          </label>
          
          {/* Add New Stage */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <select
                value={newStage.stage}
                onChange={(e) => setNewStage(prev => ({ ...prev, stage: e.target.value as InterviewStage }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#111827' }}
              >
                <option value="Phone Screening">Phone Screening</option>
                <option value="Technical Assessment">Technical Assessment</option>
                <option value="Coding Challenge">Coding Challenge</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="System Design">System Design</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Behavioral Interview">Behavioral Interview</option>
                <option value="Final Interview">Final Interview</option>
                <option value="Panel Interview">Panel Interview</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <input
                type="datetime-local"
                value={newStage.date}
                onChange={(e) => setNewStage(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#111827' }}
              />
            </div>
            
            <div>
              <select
                value={newStage.status}
                onChange={(e) => setNewStage(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#111827' }}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddStage}
                className="px-4 py-2 rounded-md transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{ 
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: '1px solid #000000',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333';
                  e.currentTarget.style.borderColor = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.borderColor = '#000000';
                }}
              >
                Add Stage
              </button>
            </div>
          </div>
          
          {/* Existing Stages */}
          <div className="space-y-2">
            {formData.interview_stages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <span className="font-medium" style={{ color: '#111827' }}>{stage.stage}</span>
                  <span style={{ color: '#6B7280' }}>{stage.date ? new Date(stage.date).toLocaleDateString() : 'No date'}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stage.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    stage.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    stage.status === 'Passed' ? 'bg-green-100 text-green-800' :
                    stage.status === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {stage.status}
                  </span>
                  <span style={{ color: '#6B7280' }}>{stage.notes || 'No notes'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStage(index)}
                  className="ml-2 px-2 py-1 rounded transition-all duration-200 hover:scale-110 cursor-pointer"
                  style={{ 
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: '1px solid #DC2626'
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
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{ color: '#374151' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{ 
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: '2px solid #000000',
              fontWeight: '600',
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333333';
              e.currentTarget.style.borderColor = '#333333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.borderColor = '#000000';
            }}
          >
            {application ? 'Update Application' : 'Add Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
