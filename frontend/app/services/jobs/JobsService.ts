import { ApiService } from '../base/ApiService';
import { Job, JobCreate, JobUpdate, JobBulkUpdate, JobStats, Contact, ContactCreate } from '../../types/job';

export class JobsService extends ApiService {
  private baseUrl = '/jobs';

  async getJobs(status?: string, limit = 100, offset = 0): Promise<Job[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await this.get(`${this.baseUrl}/?${params.toString()}`);
    return response;
  }

  async getJob(jobId: number): Promise<Job> {
    const response = await this.get(`${this.baseUrl}/${jobId}`);
    return response;
  }

  async createJob(jobData: JobCreate): Promise<Job> {
    const response = await this.post(`${this.baseUrl}/`, jobData);
    return response;
  }

  async updateJob(jobId: number, jobData: JobUpdate): Promise<Job> {
    const response = await this.put(`${this.baseUrl}/${jobId}`, jobData);
    return response;
  }

  async deleteJob(jobId: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${jobId}`);
  }

  async bulkUpdateJobs(bulkData: JobBulkUpdate): Promise<{ message: string }> {
    const response = await this.patch(`${this.baseUrl}/bulk-update`, bulkData);
    return response;
  }

  async getJobStats(): Promise<JobStats> {
    const response = await this.get(`${this.baseUrl}/stats`);
    return response;
  }

  // Contact methods
  async addContact(jobId: number, contactData: ContactCreate): Promise<Contact> {
    const response = await this.post(`${this.baseUrl}/${jobId}/contacts`, contactData);
    return response;
  }

  async updateContact(jobId: number, contactId: number, contactData: Partial<ContactCreate>): Promise<Contact> {
    const response = await this.put(`${this.baseUrl}/${jobId}/contacts/${contactId}`, contactData);
    return response;
  }

  async deleteContact(jobId: number, contactId: number): Promise<void> {
    await this.delete(`${this.baseUrl}/${jobId}/contacts/${contactId}`);
  }
}

export const jobsService = new JobsService();