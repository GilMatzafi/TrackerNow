"use client";

import Avatar from '../Avatar';

interface ApplicationsTableProps {
  data: Array<{
    company: string;
    position: string;
    status: string;
    date: string;
  }>;
}

export default function ApplicationsTable({ data }: ApplicationsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return '📝';
      case 'interview':
        return '🎯';
      case 'offer':
        return '🎉';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          <p className="text-sm text-gray-500">Latest job applications</p>
        </div>
        <button className="text-primary hover:text-primary/80 font-medium text-sm">
          See All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-0 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </th>
              <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((application, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-0 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </td>
                <td className="px-0 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold text-sm">
                        {application.company[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.company}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-0 py-4">
                  <div className="text-sm text-gray-900">{application.position}</div>
                </td>
                <td className="px-0 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    <span className="mr-1">{getStatusIcon(application.status)}</span>
                    {application.status}
                  </span>
                </td>
                <td className="px-0 py-4">
                  <div className="text-sm text-gray-500">
                    {new Date(application.date).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {data.filter(app => app.status === 'Applied').length}
            </div>
            <div className="text-gray-500">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {data.filter(app => app.status === 'Interview').length}
            </div>
            <div className="text-gray-500">Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {data.filter(app => app.status === 'Offer').length}
            </div>
            <div className="text-gray-500">Offers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
