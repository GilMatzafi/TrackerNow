"use client";

import React from 'react';
import { Job } from '../../types/job';

interface JobCardProps extends Job {
  onDragStart?: (e: React.DragEvent, jobId: number) => void;
  onDragEnd?: () => void;
  onClick?: (job: Job) => void;
  onDelete?: (jobId: number) => void;
}

export default function JobCard({
  id,
  company,
  position,
  location,
  salary,
  notes,
  tags = [],
  status,
  applied_date,
  interview_time,
  company_logo,
  is_referral,
  referrer_name,
  onDragStart,
  onDragEnd,
  onClick,
  onDelete
}: JobCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id.toString());
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
        notes,
        tags,
        status,
        applied_date,
        interview_time,
        company_logo,
        is_referral,
        referrer_name,
        created_at: '',
        updated_at: '',
        user_id: 0
      } as Job);
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
          {company_logo ? (
            <img src={company_logo} alt={company} className="w-8 h-8 rounded" />
          ) : (
            <span className="text-sm font-semibold text-gray-600">
              {company.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">{position}</h3>
            {is_referral && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Referral
              </span>
            )}
          </div>
          <p className="text-lg font-semibold text-gray-700">{company}</p>
          {location && <p className="text-base text-gray-600">{location}</p>}
          {is_referral && referrer_name && (
            <p className="text-sm text-green-600 font-medium">Referred by: {referrer_name}</p>
          )}
        </div>
      </div>

      {/* Applied Date */}
      {applied_date && (
        <div className="mb-4">
          <p className="text-xl font-semibold text-gray-900">
            Applied: {new Date(applied_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Note */}
      {notes && (
        <div className="mb-4">
          <p className="text-base text-gray-700 line-clamp-2">{notes}</p>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 text-base font-medium bg-gray-100 text-gray-700 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete job"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
