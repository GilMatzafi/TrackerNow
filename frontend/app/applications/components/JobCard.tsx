"use client";

interface JobCardProps {
  id: string;
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
  isReferral?: boolean;
  referrerName?: string;
  onDragStart?: (e: React.DragEvent, jobId: string) => void;
  onDragEnd?: () => void;
  onClick?: (job: any) => void;
  onDelete?: (jobId: string) => void;
}

export default function JobCard({
  id,
  company,
  position,
  location,
  salary,
  note,
  tags = [],
  status,
  appliedDate,
  interviewTime,
  companyLogo,
  isReferral,
  referrerName,
  onDragStart,
  onDragEnd,
  onClick,
  onDelete
}: JobCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(e, id);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick({
        id,
        company,
        position,
        location,
        salary,
        note,
        tags,
        status,
        appliedDate,
        interviewTime,
        companyLogo
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the click event
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
    >
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
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{position}</h3>
            {isReferral && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Referral
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{company}</p>
          {location && <p className="text-sm text-gray-500">{location}</p>}
          {isReferral && referrerName && (
            <p className="text-xs text-green-600 font-medium">Referred by: {referrerName}</p>
          )}
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
        
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete job"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
