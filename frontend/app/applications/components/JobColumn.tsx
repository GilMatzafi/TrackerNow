"use client";

import JobCard from './JobCard';
import { ReactNode } from 'react';

interface Contact {
  id: string;
  type: string;
  name: string;
  email: string;
  linkedin: string;
}

interface Job {
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
  contacts?: Contact[];
}

interface JobColumnProps {
  title: string;
  count: number;
  jobs: Job[];
  color?: string;
  icon?: ReactNode;
  columnId: string;
  onJobDrop?: (e: React.DragEvent, targetColumn: string, position?: number) => void;
  onJobDragStart?: (e: React.DragEvent, jobId: string) => void;
  onJobDragEnd?: () => void;
  onJobDragOver?: (e: React.DragEvent, columnId: string, position: number) => void;
  onJobDragLeave?: () => void;
  jobDropZone?: {columnId: string, position: number} | null;
  onJobEdit?: (job: any) => void;
  onJobDelete?: (jobId: string) => void;
  onColumnDragStart?: (e: React.DragEvent) => void;
  onColumnDrop?: (e: React.DragEvent) => void;
  onColumnDragOver?: (e: React.DragEvent) => void;
  onColumnDragLeave?: () => void;
  onColumnDragEnd?: () => void;
  isDraggable?: boolean;
}

export default function JobColumn({ 
  title, 
  count, 
  jobs, 
  color = "gray", 
  icon,
  columnId,
  onJobDrop,
  onJobDragStart,
  onJobDragEnd,
  onJobDragOver,
  onJobDragLeave,
  jobDropZone,
  onJobEdit,
  onJobDelete,
  onColumnDragStart,
  onColumnDrop,
  onColumnDragOver,
  onColumnDragLeave,
  onColumnDragEnd,
  isDraggable = false
}: JobColumnProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 bg-blue-50';
      case 'green':
        return 'border-green-200 bg-green-50';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50';
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'purple':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      onDrop(e, title);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (onDragOver) {
      onDragOver(e);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDragEnter) {
      onDragEnter(e);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDragLeave) {
      onDragLeave(e);
    }
  };

  return (
    <div className="w-full">
      {/* Column Wrapper - White Card */}
      <div 
        className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 h-full transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {/* Column Header */}
        <div 
          className={`flex items-center justify-between mb-6 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
          draggable={isDraggable}
          onDragStart={onColumnDragStart}
          onDrop={onColumnDrop}
          onDragOver={onColumnDragOver}
          onDragLeave={onColumnDragLeave}
          onDragEnd={onColumnDragEnd}
        >
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="w-6 h-6 text-gray-600">
                {icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {title} <span className="text-gray-500 font-normal ml-2">{count}</span>
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div key={job.id}>
              {/* Drop zone before each job */}
              {jobDropZone?.columnId === columnId && jobDropZone?.position === index && (
                <div className="h-2 bg-blue-500 rounded-full mb-2 mx-4 shadow-lg">
                  <div className="absolute -left-1 -top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              )}
              
              <div
                onDragOver={(e) => onJobDragOver?.(e, columnId, index)}
                onDragLeave={onJobDragLeave}
                onDrop={(e) => onJobDrop?.(e, title, index)}
              >
                <JobCard
                  id={job.id}
                  company={job.company}
                  position={job.position}
                  location={job.location}
                  salary={job.salary}
                  note={job.note}
                  tags={job.tags}
                  status={job.status}
                  appliedDate={job.appliedDate}
                  interviewTime={job.interviewTime}
                  companyLogo={job.companyLogo}
                  isReferral={job.isReferral}
                  referrerName={job.referrerName}
                  onDragStart={onJobDragStart}
                  onDragEnd={onJobDragEnd}
                  onClick={onJobEdit}
                  onDelete={onJobDelete}
                />
              </div>
            </div>
          ))}
          
          {/* Drop zone after last job */}
          {jobDropZone?.columnId === columnId && jobDropZone?.position === jobs.length && (
            <div 
              className="h-2 bg-blue-500 rounded-full mt-2 mx-4 shadow-lg"
              onDragOver={(e) => onJobDragOver?.(e, columnId, jobs.length)}
              onDragLeave={onJobDragLeave}
              onDrop={(e) => onJobDrop?.(e, title, jobs.length)}
            >
              <div className="absolute -left-1 -top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
