import React from 'react';
import { 
  BookmarkIcon, 
  DocumentTextIcon, 
  CalendarDaysIcon, 
  XCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { JobStatus } from '../../types/job';

export interface ColumnConfig {
  id: JobStatus;
  title: string;
  color: string;
  icon: React.ReactNode;
  emptyStateTitle: string;
  emptyStateDescription: string;
}

export const COLUMN_CONFIGS: ColumnConfig[] = [
  {
    id: 'saved',
    title: 'Saved Jobs',
    color: 'gray',
    icon: <BookmarkIcon className="w-8 h-8" />,
    emptyStateTitle: 'No saved jobs',
    emptyStateDescription: 'Save interesting job postings here for later review',
  },
  {
    id: 'applied',
    title: 'Applied',
    color: 'blue',
    icon: <DocumentTextIcon className="w-8 h-8" />,
    emptyStateTitle: 'No applications yet',
    emptyStateDescription: 'Jobs you\'ve applied to will appear here',
  },
  {
    id: 'interview',
    title: 'Interview',
    color: 'yellow',
    icon: <CalendarDaysIcon className="w-8 h-8" />,
    emptyStateTitle: 'No interviews scheduled',
    emptyStateDescription: 'Upcoming interviews will be shown here',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    color: 'red',
    icon: <XCircleIcon className="w-8 h-8" />,
    emptyStateTitle: 'No rejections',
    emptyStateDescription: 'Keep applying! Rejections are part of the process',
  },
  {
    id: 'offered',
    title: 'Offered',
    color: 'green',
    icon: <CheckCircleIcon className="w-8 h-8" />,
    emptyStateTitle: 'No offers yet',
    emptyStateDescription: 'Job offers will be displayed here',
  },
];

export const getColumnConfig = (status: JobStatus): ColumnConfig => {
  return COLUMN_CONFIGS.find(config => config.id === status) || COLUMN_CONFIGS[0];
};
