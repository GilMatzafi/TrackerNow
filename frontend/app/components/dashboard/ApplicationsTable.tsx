"use client";

import { useState } from 'react';
import { FileText, Target, Gift, X, Save, Clipboard } from 'lucide-react';
import JobDetailPage from '../../applications/components/JobDetailPage';

// import Avatar from '../Avatar'; // Unused for now

interface ApplicationsTableProps {
  data: Array<{
    company: string;
    position: string;
    status: string;
    date: string;
  }>;
}

export default function ApplicationsTable({ data }: ApplicationsTableProps) {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);

  const handleRowClick = (application: any) => {
    // Create a job object from the application data
    const jobData = {
      id: Math.random(), // Generate a temporary ID
      company: application.company,
      position: application.position,
      status: application.status,
      applied_date: application.date,
      location: '',
      salary: '',
      company_description: '',
      description: '',
      position_description: '',
      notes: '',
      tags: [],
      interview_time: '',
      company_logo: '',
      is_referral: false,
      referrer_name: '',
      created_at: application.date,
      updated_at: application.date,
      user_id: 1
    };
    
    setSelectedJob(jobData);
    setIsJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setIsJobDetailOpen(false);
    setSelectedJob(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-gray-100 text-gray-700';
      case 'interview':
        return 'bg-gray-100 text-gray-700';
      case 'offered':
        return 'bg-gray-100 text-gray-700';
      case 'rejected':
        return 'bg-gray-100 text-gray-700';
      case 'saved':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return <FileText className="w-4 h-4" />;
      case 'interview':
        return <Target className="w-4 h-4" />;
      case 'offered':
        return <Gift className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      case 'saved':
        return <Save className="w-4 h-4" />;
      default:
        return <Clipboard className="w-4 h-4" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-5xl font-semibold text-gray-900">Recent Applications</h3>
          <p className="text-2xl text-gray-500">Latest job applications</p>
        </div>
        <button className="text-primary hover:text-primary/80 font-medium text-2xl cursor-pointer">
          See All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-0 py-4 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-0 py-4 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-0 py-4 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-0 py-4 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((application, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(application)}>
                <td className="px-0 py-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-primary font-semibold text-xl">
                        {application.company[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-xl font-medium text-gray-900">
                        {application.company}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-0 py-6">
                  <div className="text-xl text-gray-900">{application.position}</div>
                </td>
                <td className="px-0 py-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-xl font-medium ${getStatusColor(application.status)}`}>
                    <span className="mr-3">{getStatusIcon(application.status)}</span>
                    {application.status}
                  </span>
                </td>
                <td className="px-0 py-6">
                  <div className="text-xl text-gray-500">
                    {new Date(application.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Job Detail Modal */}
      {isJobDetailOpen && selectedJob && (
        <JobDetailPage
          job={selectedJob}
          onClose={handleCloseJobDetail}
          isAddingNewJob={false}
        />
      )}
    </div>
  );
}
