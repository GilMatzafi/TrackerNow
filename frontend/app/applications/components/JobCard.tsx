"use client";

interface JobCardProps {
  company: string;
  position: string;
  location?: string;
  salary?: string;
  note?: string;
  tags?: string[];
  status?: string;
  appliedDate?: string;
  interviewTime?: string;
  companyLogo?: string;
}

export default function JobCard({
  company,
  position,
  location,
  salary,
  note,
  tags = [],
  status,
  appliedDate,
  interviewTime,
  companyLogo
}: JobCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      {/* Company Logo and Basic Info */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {companyLogo ? (
            <img src={companyLogo} alt={company} className="w-8 h-8 rounded" />
          ) : (
            <span className="text-sm font-semibold text-gray-600">
              {company.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{position}</h3>
          <p className="text-sm text-gray-600">{company}</p>
          {location && <p className="text-sm text-gray-500">{location}</p>}
        </div>
      </div>

      {/* Salary */}
      {salary && (
        <div className="mb-3">
          <p className="text-lg font-medium text-gray-900">{salary}</p>
        </div>
      )}

      {/* Note */}
      {note && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">{note}</p>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Status and Date */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {interviewTime && (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
          <span className="text-sm text-gray-500">
            {interviewTime || appliedDate || status}
          </span>
        </div>
      </div>
    </div>
  );
}
