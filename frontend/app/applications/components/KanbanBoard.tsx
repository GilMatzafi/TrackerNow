"use client";

import React, { useState } from 'react';
import JobColumn from './JobColumn';
import JobDetailPage from './JobDetailPage';
import { 
  BookmarkIcon, 
  DocumentTextIcon, 
  CalendarDaysIcon, 
  XCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

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
  // Referral fields
  isReferral?: boolean;
  referrerName?: string;
  companyDescription?: string;
  positionDescription?: string;
  cv?: string;
  contacts?: Contact[];
}

interface Column {
  id: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  jobs: Job[];
}

export default function KanbanBoard() {
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [jobDropZone, setJobDropZone] = useState<{columnId: string, position: number} | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);
  
  // Mock data - this will be replaced with real data from your backend
  const [savedJobs, setSavedJobs] = useState<Job[]>([
    {
      id: '1',
      company: 'Facebook',
      position: 'Principal UI/UX Designer',
      location: 'Menlo Park, CA'
    },
    {
      id: '2',
      company: 'Zoom',
      position: 'Senior interaction Designer',
      location: 'Menlo Park, CA'
    },
    {
      id: '3',
      company: 'Taobao',
      position: 'UI/UX Designer',
      location: 'Menlo Park, CA'
    },
    {
      id: '4',
      company: 'Reddit',
      position: 'Senior Lead Designer',
      location: 'Menio Park, CA'
    },
    {
      id: '5',
      company: 'Opera',
      position: 'Principal UI/UX Designer Manager',
      location: 'Menio Park, CA'
    },
    {
      id: '6',
      company: 'Google',
      position: 'UI/UX Designer Manager',
      location: 'Menio Park, CA'
    }
  ]);

  const [appliedJobs, setAppliedJobs] = useState<Job[]>([
    {
      id: '7',
      company: 'Mailchimp',
      position: 'UI/UX Designer Manager',
      note: 'This section will show notes refference o...',
      appliedDate: 'Applied today'
    },
    {
      id: '8',
      company: 'Intercom',
      position: 'Sr. UI/UX Manager',
      note: 'This section will show notes refference o...',
      appliedDate: 'Applied today'
    },
    {
      id: '9',
      company: 'Asana',
      position: 'Front-end Developer',
      note: 'This section will show notes refference o...',
      appliedDate: 'Applied today'
    },
    {
      id: '10',
      company: 'Asana',
      position: 'Principal UI/UX Designer',
      note: 'This section will show notes refference o...',
      appliedDate: 'Applied today'
    }
  ]);

  const [interviewJobs, setInterviewJobs] = useState<Job[]>([
    {
      id: '11',
      company: 'Youtube',
      position: 'Backend Developer',
      note: 'This section will show notes refference o...',
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '12',
      company: 'Pinterest',
      position: 'UI/UX Designer Manager',
      note: 'This section will show notes refference o...',
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '13',
      company: 'Ubuntu',
      position: 'UI/UX Designer Manager',
      note: 'This section will show notes refference o...',
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '14',
      company: 'Snapchat',
      position: 'UI/UX Designer Manager',
      note: 'This section will show notes refference o...',
      interviewTime: 'Today 9:30 AM'
    },
    {
      id: '15',
      company: 'Whatsapp',
      position: 'UI/UX Designer Manager',
      note: 'This section will show notes refference o...',
      interviewTime: 'Today 9:30 AM'
    }
  ]);

  const [rejectedJobs, setRejectedJobs] = useState<Job[]>([
    {
      id: '16',
      company: 'Skrill',
      position: 'UI/UX Designer',
      note: 'This section will show notes refference o...',
    },
    {
      id: '17',
      company: 'Coinbase',
      position: 'Principal UI/UX Designer',
      note: 'This section will show notes refference o...',
    },
    {
      id: '18',
      company: 'Line',
      position: 'Principal UI/UX Designer',
      note: 'This section will show notes refference o...',
    },
    {
      id: '19',
      company: 'OK',
      position: 'UI/UX Designer',
      note: 'This section will show notes refference o...',
    }
  ]);

  const [offeredJobs, setOfferedJobs] = useState<Job[]>([
    {
      id: '20',
      company: 'Atlassian',
      position: 'Lead UI/UX Designer',
      note: 'This section will show notes refference o...',
    },
    {
      id: '21',
      company: 'Microsoft',
      position: 'Product UI/UX Designer Manager',
      note: 'This section will show notes refference o...',
    },
    {
      id: '22',
      company: 'Gumroad',
      position: 'Principal UI/UX Designer Manager',
      note: 'This section will show notes refference o...',
    }
  ]);

  // Define columns with their data
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'saved',
      title: 'Saved Jobs',
      color: 'gray',
      icon: <BookmarkIcon />,
      jobs: savedJobs
    },
    {
      id: 'applied',
      title: 'Applied Jobs',
      color: 'blue',
      icon: <DocumentTextIcon />,
      jobs: appliedJobs
    },
    {
      id: 'interview',
      title: 'Interviews',
      color: 'yellow',
      icon: <CalendarDaysIcon />,
      jobs: interviewJobs
    },
    {
      id: 'rejected',
      title: 'Rejected Jobs',
      color: 'red',
      icon: <XCircleIcon />,
      jobs: rejectedJobs
    },
    {
      id: 'offered',
      title: 'Offered Jobs',
      color: 'green',
      icon: <CheckCircleIcon />,
      jobs: offeredJobs
    }
  ]);

  // Update columns when job arrays change
  React.useEffect(() => {
    setColumns(prev => prev.map(col => {
      switch (col.id) {
        case 'saved':
          return { ...col, jobs: savedJobs };
        case 'applied':
          return { ...col, jobs: appliedJobs };
        case 'interview':
          return { ...col, jobs: interviewJobs };
        case 'rejected':
          return { ...col, jobs: rejectedJobs };
        case 'offered':
          return { ...col, jobs: offeredJobs };
        default:
          return col;
      }
    }));
  }, [savedJobs, appliedJobs, interviewJobs, rejectedJobs, offeredJobs]);

  // Add new column
  const addNewColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn: Column = {
      id: newColumnId,
      title: 'New Column',
      color: 'purple',
      icon: <BookmarkIcon />,
      jobs: []
    };
    setColumns(prev => [...prev, newColumn]);
  };

  // Reorder columns
  const reorderColumns = (startIndex: number, endIndex: number) => {
    const newColumns = Array.from(columns);
    const [removed] = newColumns.splice(startIndex, 1);
    newColumns.splice(endIndex, 0, removed);
    setColumns(newColumns);
  };

  // Handle column drag and drop
  const handleColumnDragStart = (e: React.DragEvent, columnIndex: number) => {
    setDraggedColumnIndex(columnIndex);
    e.dataTransfer.setData('text/plain', columnIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image that shows the entire column
    const columnElement = e.currentTarget.closest('.column-container');
    if (columnElement) {
      const dragImage = columnElement.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(5deg)';
      dragImage.style.opacity = '0.8';
      dragImage.style.border = '2px solid #3B82F6';
      dragImage.style.borderRadius = '12px';
      dragImage.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 180, 50);
      
      // Clean up the drag image after a short delay
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnIndex(null);
    setDragOverIndex(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(targetIndex);
  };

  const handleColumnDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleColumnDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (sourceIndex !== targetIndex) {
      reorderColumns(sourceIndex, targetIndex);
    }
    
    setDraggedColumnIndex(null);
    setDragOverIndex(null);
  };

  // Helper function to get the current column for a job
  const getJobColumn = (jobId: string): { jobs: Job[], setJobs: React.Dispatch<React.SetStateAction<Job[]>>, columnName: string } | null => {
    if (savedJobs.find(job => job.id === jobId)) {
      return { jobs: savedJobs, setJobs: setSavedJobs, columnName: 'Saved Jobs' };
    }
    if (appliedJobs.find(job => job.id === jobId)) {
      return { jobs: appliedJobs, setJobs: setAppliedJobs, columnName: 'Applied Jobs' };
    }
    if (interviewJobs.find(job => job.id === jobId)) {
      return { jobs: interviewJobs, setJobs: setInterviewJobs, columnName: 'Interviews' };
    }
    if (rejectedJobs.find(job => job.id === jobId)) {
      return { jobs: rejectedJobs, setJobs: setRejectedJobs, columnName: 'Rejected Jobs' };
    }
    if (offeredJobs.find(job => job.id === jobId)) {
      return { jobs: offeredJobs, setJobs: setOfferedJobs, columnName: 'Offered Jobs' };
    }
    return null;
  };

  // Helper function to get the target column setter
  const getTargetColumn = (columnName: string): { jobs: Job[], setJobs: React.Dispatch<React.SetStateAction<Job[]>> } | null => {
    switch (columnName) {
      case 'Saved Jobs':
        return { jobs: savedJobs, setJobs: setSavedJobs };
      case 'Applied Jobs':
        return { jobs: appliedJobs, setJobs: setAppliedJobs };
      case 'Interviews':
        return { jobs: interviewJobs, setJobs: setInterviewJobs };
      case 'Rejected Jobs':
        return { jobs: rejectedJobs, setJobs: setRejectedJobs };
      case 'Offered Jobs':
        return { jobs: offeredJobs, setJobs: setOfferedJobs };
      default:
        return null;
    }
  };

  // Handle job drag start
  const handleJobDragStart = (e: React.DragEvent, jobId: string) => {
    setDraggedJobId(jobId);
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle job drag end
  const handleJobDragEnd = () => {
    setDraggedJobId(null);
    setJobDropZone(null);
  };

  // Handle job drop
  const handleJobDrop = (e: React.DragEvent, targetColumn: string, position?: number) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('text/plain');
    
    // Find the job in the current column
    const sourceColumn = getJobColumn(jobId);
    const targetColumnData = getTargetColumn(targetColumn);
    
    if (!sourceColumn || !targetColumnData) {
      return;
    }
    
    // Find the job to move
    const jobToMove = sourceColumn.jobs.find(job => job.id === jobId);
    if (!jobToMove) {
      return;
    }
    
    // Remove from source column
    sourceColumn.setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    
    // Add to target column at specific position or at the end
    if (position !== undefined && position >= 0) {
      targetColumnData.setJobs(prevJobs => {
        const newJobs = [...prevJobs];
        newJobs.splice(position, 0, jobToMove);
        return newJobs;
      });
    } else {
      targetColumnData.setJobs(prevJobs => [...prevJobs, jobToMove]);
    }
    
    setDraggedJobId(null);
    setJobDropZone(null);
  };

  // Handle job drag over
  const handleJobDragOver = (e: React.DragEvent, columnId: string, position: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setJobDropZone({columnId, position});
  };

  // Handle job drag leave
  const handleJobDragLeave = () => {
    setJobDropZone(null);
  };

  // Handle job edit
  const handleJobView = (job: Job) => {
    setViewingJob(job);
    setIsDetailPageOpen(true);
  };

  const handleCloseDetailPage = () => {
    setIsDetailPageOpen(false);
    setViewingJob(null);
  };

  // Handle job delete
  const handleJobDelete = (jobId: string) => {
    // Remove the job from the appropriate column
    const removeJobFromColumn = (setJobs: React.Dispatch<React.SetStateAction<Job[]>>) => {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    };

    // Find and remove the job from the correct column
    if (savedJobs.find(job => job.id === jobId)) {
      removeJobFromColumn(setSavedJobs);
    } else if (appliedJobs.find(job => job.id === jobId)) {
      removeJobFromColumn(setAppliedJobs);
    } else if (interviewJobs.find(job => job.id === jobId)) {
      removeJobFromColumn(setInterviewJobs);
    } else if (rejectedJobs.find(job => job.id === jobId)) {
      removeJobFromColumn(setRejectedJobs);
    } else if (offeredJobs.find(job => job.id === jobId)) {
      removeJobFromColumn(setOfferedJobs);
    }
  };





  return (
    <div className="flex justify-center w-full" style={{marginTop: '100px'}}>
      <div className="flex gap-6">
        {columns.map((column, index) => (
          <div key={column.id} className="relative">
            {/* Drop indicator before column */}
            {dragOverIndex === index && draggedColumnIndex !== null && draggedColumnIndex !== index && (
              <div className="absolute -left-3 top-0 w-1 h-full bg-blue-500 rounded-full z-10 shadow-lg">
                <div className="absolute -top-2 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            )}
            
            <div 
              className={`w-[360px] column-container transition-all duration-200 ${
                draggedColumnIndex === index 
                  ? 'opacity-50 scale-95 transform rotate-1' 
                  : 'opacity-100 scale-100 transform rotate-0'
              }`}
            >
              <JobColumn
                title={column.title}
                count={column.jobs.length}
                jobs={column.jobs}
                color={column.color}
                icon={column.icon}
                onJobDrop={handleJobDrop}
                onJobDragStart={handleJobDragStart}
                onJobDragEnd={handleJobDragEnd}
                onJobDragOver={handleJobDragOver}
                onJobDragLeave={handleJobDragLeave}
                jobDropZone={jobDropZone}
                columnId={column.id}
                  onJobEdit={handleJobView}
                  onJobDelete={handleJobDelete}
                onColumnDragStart={(e) => handleColumnDragStart(e, index)}
                onColumnDrop={(e) => handleColumnDrop(e, index)}
                onColumnDragOver={(e) => handleColumnDragOver(e, index)}
                onColumnDragLeave={handleColumnDragLeave}
                onColumnDragEnd={handleColumnDragEnd}
                isDraggable={true}
              />
            </div>
          </div>
        ))}
        
        {/* Drop indicator after last column */}
        {dragOverIndex === columns.length && draggedColumnIndex !== null && (
          <div className="absolute -right-3 top-0 w-1 h-full bg-blue-500 rounded-full z-10 shadow-lg">
            <div className="absolute -top-2 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        )}
        
        {/* Add New Column Button */}
        <div className="w-[360px] flex items-center" style={{height: '70px'}}>
          <button
            onClick={addNewColumn}
            className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Job Detail Page */}
      {viewingJob && isDetailPageOpen && (
        <JobDetailPage
          job={viewingJob}
          onClose={handleCloseDetailPage}
          onEdit={(job) => {
            // Handle edit in the detail page itself
            console.log('Edit job:', job);
          }}
        />
      )}
    </div>
  );
}
