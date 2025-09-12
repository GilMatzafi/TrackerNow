// Export all services from a single entry point
export { authService, type User, type LoginRequest, type RegisterRequest, type UpdateUserRequest, type AuthResponse, type TokenResponse } from './auth/AuthService';
export { problemsService } from './problems/ProblemsService';
export { type Problem, type ProblemFormData } from '../types/problem';
export { booksService, type BookFormData, type BookStats } from './books/BooksService';
export { videosService, type VideoFormData, type VideoStats } from './videos/VideosService';
export { type Book, type Video, type ResourceType, type ResourceStatus, type ResourcePriority, type ResourceCategory } from '../types/resource';
export { onboardingTasksService, type OnboardingTask, type CreateOnboardingTask, type UpdateOnboardingTask } from './onboardingTasks';
export { calendarEventsService, type CalendarEvent, type CreateCalendarEvent, type UpdateCalendarEvent } from './calendarEvents';
export { pomodoroSessionsService, type PomodoroSession, type CreatePomodoroSession, type UpdatePomodoroSession, type PomodoroStats, type TodayWorkTimeStats } from './pomodoroSessions';

// For backward compatibility, export authService as the default
export { authService as default } from './auth/AuthService';
