"use client";

import React, { useState } from 'react';
import JobColumn from './JobColumn';
import JobDetailPage from './JobDetailPage';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useJobs } from '../../hooks/useJobs';
import { useDragDrop } from '../../hooks/useDragDrop';
import { COLUMN_CONFIGS } from '../constants/columns';
import { Job, JobStatus, JobCreate } from '../../types/job';

export default function KanbanBoard() {
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('saved');
  
  // Use the real API data
  const { 
    jobs, 
    loading, 
    error, 
    createJob,
    updateJob, 
    deleteJob,
    getJobsByStatus,
    refreshJobs
  } = useJobs();
  
  // Use drag and drop hook
  const {
    dragState,
    handleColumnDragStart,
    handleColumnDragEnd,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleJobDragStart,
    handleJobDragOver,
    handleJobDragLeave,
    resetDragState,
  } = useDragDrop();

  // Get jobs by status
  const savedJobs = getJobsByStatus('saved');
  const appliedJobs = getJobsByStatus('applied');
  const interviewJobs = getJobsByStatus('interview');
  const rejectedJobs = getJobsByStatus('rejected');
  const offeredJobs = getJobsByStatus('offered');

  // Create columns with real data
  const columns = COLUMN_CONFIGS.map(config => ({
    ...config,
    jobs: getJobsByStatus(config.id)
  }));

  const handleJobDrop = async (e: React.DragEvent, targetColumn: JobStatus, position?: number) => {
    e.preventDefault();
    const jobId = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (!jobId || isNaN(jobId)) return;

    try {
      await updateJob(jobId, { status: targetColumn });
      resetDragState();
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  const handleJobEdit = (job: Job) => {
    setViewingJob(job);
    setIsDetailPageOpen(true);
  };

  const handleJobDelete = async (jobId: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const handleCloseDetailPage = () => {
    setIsDetailPageOpen(false);
    setViewingJob(null);
    setSelectedStatus('saved');
  };

  const handleAddJob = (status: JobStatus) => {
    setSelectedStatus(status);
    // Create a new job template and open JobDetailPage
    const newJob: Job = {
      id: 0, // Temporary ID for new jobs
      company: '',
      position: '',
      location: '',
      salary: '',
      company_description: '',
      description: '',
      position_description: '',
      notes: '',
      tags: [],
      status: status,
      applied_date: new Date().toISOString().split('T')[0],
      job_link: '',
      company_logo: '',
      is_referral: false,
      referrer_name: '',
      interview_time: '',
      cv_link: '',
      contacts: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 0
    };
    setViewingJob(newJob);
    setIsDetailPageOpen(true);
  };


  // Loading state
  if (loading) {
    return <LoadingState message="Loading your job applications..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refreshJobs} />;
  }

  return (
    <div className="w-full">
      {/* Kanban Board */}
      <div className="flex justify-center px-8">
        <div className="w-full max-w-[2400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {columns.map((column, index) => (
              <div key={column.id} className="w-[450px]">
              <JobColumn
                  config={column}
                jobs={column.jobs}
                onJobDrop={handleJobDrop}
                onJobDragStart={handleJobDragStart}
                  onJobDragEnd={handleColumnDragEnd}
                onJobDragOver={handleJobDragOver}
                onJobDragLeave={handleJobDragLeave}
                  jobDropZone={dragState.jobDropZone}
                  onJobEdit={handleJobEdit}
                  onJobDelete={handleJobDelete}
                  onAddJob={handleAddJob}
                onColumnDragStart={(e) => handleColumnDragStart(e, index)}
                  onColumnDrop={handleColumnDragEnd}
                onColumnDragOver={(e) => handleColumnDragOver(e, index)}
                onColumnDragLeave={handleColumnDragLeave}
                onColumnDragEnd={handleColumnDragEnd}
                  isDraggable={false}
              />
          </div>
        ))}
          </div>
        </div>
      </div>
      
      {/* Job Detail Modal */}
      {isDetailPageOpen && viewingJob && (
        <JobDetailPage
          job={viewingJob}
          onClose={handleCloseDetailPage}
          onEdit={handleJobEdit}
          isAddingNewJob={viewingJob.id === 0}
        />
      )}
    </div>
  );
}