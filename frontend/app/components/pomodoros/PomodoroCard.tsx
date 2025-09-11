"use client";

import { Pomodoro } from '../../types/pomodoro';

interface PomodoroCardProps {
  pomodoro: Pomodoro;
  onEdit: (pomodoro: Pomodoro) => void;
  onDelete: (id: number) => void;
  onStart: (id: number) => void;
  isActive?: boolean;
}

export default function PomodoroCard({ 
  pomodoro, 
  onEdit, 
  onDelete, 
  onStart,
  isActive = false 
}: PomodoroCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'WORK':
        return 'bg-red-100 text-red-800';
      case 'SHORT_BREAK':
        return 'bg-green-100 text-green-800';
      case 'LONG_BREAK':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'RUNNING':
        return 'bg-green-100 text-green-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'WORK':
        return 'Work';
      case 'SHORT_BREAK':
        return 'Short Break';
      case 'LONG_BREAK':
        return 'Long Break';
      default:
        return type;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'RUNNING':
        return 'Running';
      case 'PAUSED':
        return 'Paused';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canStart = pomodoro.status === 'PENDING' && !isActive;
  const canEdit = pomodoro.status === 'PENDING';
  const canDelete = pomodoro.status === 'PENDING';

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
      isActive ? 'ring-2 ring-primary ring-opacity-50' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{pomodoro.title}</h3>
          <div className="flex gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(pomodoro.pomodoro_type)}`}>
              {getTypeDisplayName(pomodoro.pomodoro_type)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pomodoro.status)}`}>
              {getStatusDisplayName(pomodoro.status)}
            </span>
            {isActive && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                Active
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          {canEdit && (
            <button
              onClick={() => onEdit(pomodoro)}
              className="p-2 text-gray-400 hover:text-primary transition-all duration-200 hover:scale-110"
              title="Edit pomodoro"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(pomodoro.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110"
              title="Delete pomodoro"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {pomodoro.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{pomodoro.description}</p>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {pomodoro.duration_minutes} minutes
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Created {formatDate(pomodoro.created_at)}
        </div>
        {pomodoro.started_at && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Started {formatDate(pomodoro.started_at)}
          </div>
        )}
        {pomodoro.completed_at && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed {formatDate(pomodoro.completed_at)}
          </div>
        )}
        {pomodoro.paused_duration_seconds > 0 && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Paused for {Math.floor(pomodoro.paused_duration_seconds / 60)}m {pomodoro.paused_duration_seconds % 60}s
          </div>
        )}
      </div>

      {/* Action Button */}
      {canStart && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onStart(pomodoro.id)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Start Pomodoro
          </button>
        </div>
      )}
    </div>
  );
}
