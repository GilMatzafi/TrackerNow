"use client";

import { useState, useEffect } from 'react';
import { useCalendarEvents, CalendarEvent } from '../../hooks/useCalendarEvents';

// Custom launch animation styles
const launchModalStyles = `
  @keyframes launchModal {
    0% {
      transform: scale(0.2) translateY(80px) rotateX(15deg);
      opacity: 0;
      filter: blur(4px);
    }
    30% {
      transform: scale(0.8) translateY(20px) rotateX(5deg);
      opacity: 0.6;
      filter: blur(1px);
    }
    60% {
      transform: scale(1.08) translateY(-8px) rotateX(-2deg);
      opacity: 0.9;
      filter: blur(0px);
    }
    80% {
      transform: scale(0.98) translateY(2px) rotateX(1deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) translateY(0) rotateX(0deg);
      opacity: 1;
    }
  }
`;

interface CalendarCardProps {
  className?: string;
}

export default function CalendarCard({ className = "" }: CalendarCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const { events, loading, error, createEvent, deleteEvent } = useCalendarEvents(currentYear, currentMonth);

  // Reset form state when date changes
  useEffect(() => {
    setShowEventForm(false);
    setSelectedDate(null);
  }, [currentDate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getCurrentWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };


  const getEventsForDate = (date: Date) => {
    if (!events) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString();
    });
  };


  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const location = formData.get('location') as string;
    const eventType = formData.get('eventType') as string;

    try {
      await createEvent({
        title,
        description: description || undefined,
        start_time: new Date(`${selectedDate.toISOString().split('T')[0]}T${startTime}`).toISOString(),
        end_time: new Date(`${selectedDate.toISOString().split('T')[0]}T${endTime}`).toISOString(),
        location: location || undefined,
        event_type: eventType || undefined
      });
      
      setShowEventForm(false);
      setSelectedDate(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigateWeek('prev')}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            Today
          </button>
          <button 
            onClick={() => navigateWeek('next')}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900">
          {(() => {
            const week = getCurrentWeek(currentDate);
            const startDate = week[0];
            const endDate = week[6];
            if (startDate.getMonth() === endDate.getMonth()) {
              return `${startDate.getDate()}-${endDate.getDate()} ${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
            } else {
              return `${startDate.getDate()} ${monthNames[startDate.getMonth()]} - ${endDate.getDate()} ${monthNames[endDate.getMonth()]} ${startDate.getFullYear()}`;
            }
          })()}
        </h3>
        
        <div className="w-20"></div> {/* Spacer for balance */}
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm text-gray-600 py-3 font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {getCurrentWeek(currentDate).map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const uniqueKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-${index}`;

          return (
            <div
              key={uniqueKey}
              className={`h-20 flex flex-col items-center justify-center text-lg cursor-pointer rounded-xl hover:bg-gray-50 transition-all duration-200 relative border-2 ${
                isToday 
                  ? 'bg-blue-50 text-blue-600 font-bold border-blue-200 shadow-sm' 
                  : isWeekend 
                    ? 'text-gray-400 border-gray-100' 
                    : 'text-gray-700 border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => handleDateClick(day)}
            >
              <span className="text-lg font-semibold">{day.getDate()}</span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {dayEvents.slice(0, 3).map((_, eventIndex) => (
                    <div 
                      key={eventIndex}
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                    ></div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Events list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No events this week
          </div>
        ) : (
          events.slice(0, 8).map(event => {
            const eventDate = new Date(event.start_time);
            const startTime = eventDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
            const eventDay = eventDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });

            const getEventTypeColor = (type?: string) => {
              switch (type) {
                case 'meeting': return 'bg-blue-100 text-blue-800';
                case 'task': return 'bg-green-100 text-green-800';
                case 'reminder': return 'bg-yellow-100 text-yellow-800';
                case 'interview': return 'bg-purple-100 text-purple-800';
                case 'study': return 'bg-orange-100 text-orange-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };

            return (
              <div key={event.id} className="bg-gray-50 p-3 rounded-lg text-xs hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      {event.event_type && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                          {event.event_type}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs">
                      📅 {eventDay} at {startTime}
                    </p>
                    {event.location && (
                      <p className="text-gray-500 text-xs">📍 {event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-500 hover:text-red-700 ml-2 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete event"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Event creation form modal */}
      {showEventForm && selectedDate && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => {
            setShowEventForm(false);
            setSelectedDate(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 w-[600px] max-w-full mx-4 shadow-2xl border border-gray-100 relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            <button
              onClick={() => {
                setShowEventForm(false);
                setSelectedDate(null);
              }}
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-2xl font-semibold mb-6 pr-8">
              Add Event - {selectedDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    name="startTime"
                    type="time"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    name="endTime"
                    type="time"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  name="eventType"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="">Select type</option>
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="reminder">Reminder</option>
                  <option value="interview">Interview</option>
                  <option value="study">Study</option>
                </select>
              </div>
              
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-lg font-medium cursor-pointer"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEventForm(false);
                    setSelectedDate(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors text-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
