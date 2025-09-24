// Export all services from a single entry point
export { authService, type User, type LoginRequest, type RegisterRequest, type UpdateUserRequest, type AuthResponse, type TokenResponse } from './auth/AuthService';
export { problemsService } from './problems/ProblemsService';
export { type Problem, type ProblemFormData } from '../types/problem';
export { onboardingTasksService, type OnboardingTask, type CreateOnboardingTask, type UpdateOnboardingTask } from './onboardingTasks';
export { calendarEventsService, type CalendarEvent, type CreateCalendarEvent, type UpdateCalendarEvent } from './calendarEvents';
export { pomodoroSessionsService, type PomodoroSession, type CreatePomodoroSession, type UpdatePomodoroSession, type PomodoroStats, type TodayWorkTimeStats } from './pomodoroSessions';

// For backward compatibility, export authService as the default
export { authService as default } from './auth/AuthService';
