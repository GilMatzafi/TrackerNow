'use client';

import React, { useState } from 'react';
import { Application, ApplicationStatus, ApplicationSource } from '@/app/types/application';

interface ApplicationsListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (id: number) => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All');
  const [sourceFilter, setSourceFilter] = useState<ApplicationSource | 'All'>('All');
  const [sortBy, setSortBy] = useState<'created_at' | 'application_date' | 'company_name'>('created_at');

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = 
        app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.role_position && app.role_position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.industry && app.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'All' || app.application_status === statusFilter;
      const matchesSource = sourceFilter === 'All' || app.application_source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'application_date':
          if (!a.application_date && !b.application_date) return 0;
          if (!a.application_date) return 1;
          if (!b.application_date) return -1;
          return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
        case 'company_name':
          return a.company_name.localeCompare(b.company_name);
        default:
          return 0;
      }
    });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 animate-slide-in-top">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Statuses</option>
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
          
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as ApplicationSource | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="All">All Sources</option>
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ color: '#111827' }}
            >
              <option value="created_at">Sort by Date Created</option>
              <option value="application_date">Sort by Application Date</option>
              <option value="company_name">Sort by Company</option>
            </select>
          </div>
        </div>
      </div>


      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium" style={{ color: '#111827' }}>No applications found</h3>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            {searchTerm || statusFilter !== 'All' || sourceFilter !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first job application.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApplications.map((application, index) => (
            <div 
              key={application.id} 
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ color: '#111827' }}>{application.job_title}</h3>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.application_status)}`}>
                      {application.application_status}
                    </span>
                    {application.application_source && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {application.application_source}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(application)}
                    className="p-2 text-gray-400 hover:text-primary transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Edit application"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(application.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Delete application"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Company Info */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {application.company_name}
                  </span>
                  {application.role_position && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {application.role_position}
                    </span>
                  )}
                  {application.industry && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {application.industry}
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm" style={{ color: '#4B5563' }}>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created {formatDate(application.created_at)}
                </div>
                {application.application_date && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Applied {formatDate(application.application_date)}
                  </div>
                )}
                {application.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {application.location}
                  </div>
                )}
                {application.job_link && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a
                      href={application.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate cursor-pointer"
                    >
                      View Job Posting
                    </a>
                  </div>
                )}
                {application.submitted_resume && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resume Submitted
                  </div>
                )}
              </div>

              {/* Interview Stages */}
              {application.interview_stages.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {application.interview_stages.map((stage, stageIndex) => (
                      <span
                        key={stageIndex}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {stage.stage}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {application.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm line-clamp-2" style={{ color: '#4B5563' }}>{application.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-slide-in-bottom">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#111827' }}>{applications.length}</div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Total Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(app => app.application_status === 'APPLIED').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(app => app.application_status === 'UNDER_REVIEW').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Under Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.application_status === 'OFFER_RECEIVED').length}
            </div>
            <div className="text-sm" style={{ color: '#6B7280' }}>Offers Received</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;
