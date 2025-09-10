'use client';

import React from 'react';
import { Application, ApplicationStatus } from '@/app/types/application';

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: ApplicationStatus) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Applied': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Phone Screening': 'bg-purple-100 text-purple-800',
      'Technical Interview': 'bg-orange-100 text-orange-800',
      'HR Interview': 'bg-green-100 text-green-800',
      'Final Interview': 'bg-indigo-100 text-indigo-800',
      'Offer Received': 'bg-emerald-100 text-emerald-800',
      'Offer Accepted': 'bg-green-100 text-green-800',
      'Offer Declined': 'bg-red-100 text-red-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 hover:scale-105">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>
              {application.job_title}
            </h3>
            <div className="flex items-center space-x-4 text-sm" style={{ color: '#6B7280' }}>
              <span className="font-medium">{application.company_name}</span>
              {application.role_position && <span>• {application.role_position}</span>}
              {application.location && <span>• {application.location}</span>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.application_status)}`}>
              {application.application_status}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(application)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer"
                title="Edit Application"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(application.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer"
                title="Delete Application"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium" style={{ color: '#374151' }}>Application Details</div>
            <div className="text-sm space-y-1" style={{ color: '#6B7280' }}>
              {application.application_date && (
                <div>Applied: {formatDate(application.application_date)}</div>
              )}
              {application.application_source && (
                <div>Source: {application.application_source}</div>
              )}
              {application.industry && (
                <div>Industry: {application.industry}</div>
              )}
              {application.submitted_resume && (
                <div className="text-green-600">✓ Resume Submitted</div>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium" style={{ color: '#374151' }}>Contact Information</div>
            <div className="text-sm space-y-1" style={{ color: '#6B7280' }}>
              {application.contact_person_name && (
                <div>Contact: {application.contact_person_name}</div>
              )}
              {application.contact_person_email && (
                <div>Email: {application.contact_person_email}</div>
              )}
              {application.job_link && (
                <div>
                  <a 
                    href={application.job_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    View Job Posting →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {application.notes && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-1" style={{ color: '#374151' }}>Notes</div>
            <p className="text-sm" style={{ color: '#6B7280' }}>{application.notes}</p>
          </div>
        )}

        {application.interview_stages.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2" style={{ color: '#374151' }}>Interview Stages</div>
            <div className="flex flex-wrap gap-2">
              {application.interview_stages.map((stage, stageIndex) => (
                <div
                  key={stageIndex}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  style={{ color: '#6B7280' }}
                >
                  {stage.stage} - {stage.status}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs" style={{ color: '#9CA3AF' }}>
            Created: {formatDate(application.created_at)}
            {application.updated_at !== application.created_at && (
              <span> • Updated: {formatDate(application.updated_at)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
