import { ApiService } from './base/ApiService';

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  event_type?: string;
  user_id: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateCalendarEvent {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  event_type?: string;
}

export interface UpdateCalendarEvent {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_type?: string;
}

class CalendarEventsService extends ApiService {
  private baseUrl = '/calendar-events';

  async getEvents(startDate?: string, endDate?: string, year?: number, month?: number): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return this.get<CalendarEvent[]>(url);
  }

  async getEvent(id: number): Promise<CalendarEvent> {
    return this.get<CalendarEvent>(`${this.baseUrl}/${id}`);
  }

  async createEvent(eventData: CreateCalendarEvent): Promise<CalendarEvent> {
    return this.post<CalendarEvent>(this.baseUrl, eventData);
  }

  async updateEvent(id: number, eventData: UpdateCalendarEvent): Promise<CalendarEvent> {
    return this.put<CalendarEvent>(`${this.baseUrl}/${id}`, eventData);
  }

  async deleteEvent(id: number): Promise<void> {
    return this.delete(`${this.baseUrl}/${id}`);
  }
}

export const calendarEventsService = new CalendarEventsService();
