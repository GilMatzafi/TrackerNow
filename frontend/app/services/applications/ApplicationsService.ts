import { ApiService } from '../base/ApiService';
import { Application, ApplicationFormData } from '../../types/application';

class ApplicationsService extends ApiService {
  // Get all applications
  async getApplications(): Promise<Application[]> {
    return this.get<Application[]>('/applications');
  }

  // Get a specific application
  async getApplication(id: number): Promise<Application> {
    return this.get<Application>(`/applications/${id}`);
  }

  // Create a new application
  async createApplication(applicationData: ApplicationFormData): Promise<Application> {
    return this.post<Application>('/applications', applicationData);
  }

  // Update an application
  async updateApplication(id: number, applicationData: Partial<ApplicationFormData>): Promise<Application> {
    return this.put<Application>(`/applications/${id}`, applicationData);
  }

  // Delete an application
  async deleteApplication(id: number): Promise<void> {
    return this.delete<void>(`/applications/${id}`);
  }
}

export const applicationsService = new ApplicationsService();
