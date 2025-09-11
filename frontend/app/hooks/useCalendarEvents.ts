import { useState, useEffect, useCallback } from 'react';
import { calendarEventsService, CalendarEvent, CreateCalendarEvent, UpdateCalendarEvent } from '../services/calendarEvents';
import { useAuth } from '../contexts/AuthContext';

export const useCalendarEvents = (year?: number, month?: number) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const fetchedEvents = await calendarEventsService.getEvents(undefined, undefined, year, month);
      setEvents(fetchedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setLoading(false);
    }
  }, [user, year, month]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(async (eventData: CreateCalendarEvent) => {
    setError(null);
    try {
      const newEvent = await calendarEventsService.createEvent(eventData);
      setEvents(prevEvents => [...prevEvents, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Failed to create calendar event:', err);
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (id: number, eventData: UpdateCalendarEvent) => {
    setError(null);
    try {
      const updatedEvent = await calendarEventsService.updateEvent(id, eventData);
      setEvents(prevEvents => prevEvents.map(event => event.id === id ? updatedEvent : event));
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Failed to update calendar event:', err);
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (id: number) => {
    setError(null);
    try {
      await calendarEventsService.deleteEvent(id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      console.error('Failed to delete calendar event:', err);
      throw err;
    }
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEvents
  };
};
