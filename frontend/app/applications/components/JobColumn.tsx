"use client";

import React from 'react';
import JobCard from './JobCard';
import EmptyState from './EmptyState';
import { Job, JobStatus } from '../../types/job';
import { ColumnConfig } from '../constants/columns';

interface JobColumnProps {
  config: ColumnConfig;
  jobs: Job[];
  onJobDrop?: (e: React.DragEvent, targetColumn: JobStatus, position?: number) => void;
  onJobDragStart?: (e: React.DragEvent, jobId: number) => void;
  onJobDragEnd?: () => void;
  onJobDragOver?: (e: React.DragEvent, columnId: JobStatus, position: number) => void;
  onJobDragLeave?: () => void;
  jobDropZone?: { columnId: JobStatus; position: number } | null;
  onJobEdit?: (job: Job) => void;
  onJobDelete?: (jobId: number) => void;
  onColumnDragStart?: (e: React.DragEvent) => void;
  onColumnDrop?: (e: React.DragEvent) => void;
  onColumnDragOver?: (e: React.DragEvent) => void;
  onColumnDragLeave?: () => void;
  onColumnDragEnd?: () => void;
  isDraggable?: boolean;
}

export default function JobColumn({ 
  config,
  jobs, 
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

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onColumnDrop) {
      onColumnDrop(e);
    }
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (onColumnDragOver) {
      onColumnDragOver(e);
    }
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (onColumnDragLeave) {
      onColumnDragLeave();
    }
  };

  const renderDropZone = (position: number) => (
    <div 
      className="h-2 bg-blue-500 rounded-full mb-2 mx-4 shadow-lg relative"
      onDragOver={(e) => onJobDragOver?.(e, config.id, position)}
      onDragLeave={onJobDragLeave}
      onDrop={(e) => onJobDrop?.(e, config.id, position)}
    >
      <div className="absolute -left-1 -top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="w-full">
      <div 
        className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-200 h-full transition-colors"
        onDrop={handleColumnDrop}
        onDragOver={handleColumnDragOver}
        onDragLeave={handleColumnDragLeave}
      >
        {/* Column Header */}
        <div 
          className={`flex items-center justify-between mb-8 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
          draggable={isDraggable}
          onDragStart={onColumnDragStart}
          onDrop={onColumnDrop}
          onDragOver={onColumnDragOver}
          onDragLeave={onColumnDragLeave}
          onDragEnd={onColumnDragEnd}
        >
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 text-gray-600">
              {config.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {config.title} <span className="text-gray-500 font-normal ml-3 text-lg">{jobs.length}</span>
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
        <div className="space-y-4 min-h-[600px]">
          {jobs.length === 0 ? (
            <EmptyState
              title={config.emptyStateTitle}
              description={config.emptyStateDescription}
              icon={config.icon}
            />
          ) : (
            jobs.map((job, index) => (
              <div key={job.id}>
                {/* Drop zone before each job */}
                {jobDropZone?.columnId === config.id && jobDropZone?.position === index && renderDropZone(index)}
                
                <div
                  onDragOver={(e) => onJobDragOver?.(e, config.id, index)}
                  onDragLeave={onJobDragLeave}
                  onDrop={(e) => onJobDrop?.(e, config.id, index)}
                >
                  <JobCard
                    {...job}
                    onDragStart={onJobDragStart}
                    onDragEnd={onJobDragEnd}
                    onClick={onJobEdit}
                    onDelete={onJobDelete}
                  />
                </div>
              </div>
            ))
          )}
          
          {/* Drop zone after last job */}
          {jobs.length > 0 && jobDropZone?.columnId === config.id && jobDropZone?.position === jobs.length && 
            renderDropZone(jobs.length)
          }
        </div>
      </div>
    </div>
  );
}