import { useState, useEffect, useCallback } from 'react';
import { jobsService } from '../services/jobs/JobsService';
import { Job, JobCreate, JobUpdate, JobBulkUpdate, JobStats, ContactCreate, JobStatus } from '../types/job';

export interface UseJobsReturn {
  // Data
  jobs: Job[];
  jobStats: JobStats | null;
  
  // Loading states
  loading: boolean;
  statsLoading: boolean;
  
  // Error states
  error: string | null;
  statsError: string | null;
  
  // Actions
  createJob: (jobData: JobCreate) => Promise<Job>;
  updateJob: (jobId: number, jobData: JobUpdate) => Promise<Job>;
  deleteJob: (jobId: number) => Promise<void>;
  bulkUpdateJobs: (bulkData: JobBulkUpdate) => Promise<void>;
  refreshJobs: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Contact actions
  addContact: (jobId: number, contactData: ContactCreate) => Promise<void>;
  updateContact: (jobId: number, contactId: number, contactData: Partial<ContactCreate>) => Promise<void>;
  deleteContact: (jobId: number, contactId: number) => Promise<void>;
  
  // Utility functions
  getJobsByStatus: (status: string) => Job[];
  getJobById: (jobId: number) => Job | undefined;
}

export function useJobs(): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobStats, setJobStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch all jobs
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedJobs = await jobsService.getJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(errorMessage);
      console.error('❌ Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch job statistics
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const stats = await jobsService.getJobStats();
      setJobStats(stats);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Failed to fetch job stats');
      console.error('Error fetching job stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Create a new job
  const createJob = useCallback(async (jobData: JobCreate): Promise<Job> => {
    try {
      setError(null);
      const newJob = await jobsService.createJob(jobData);
      setJobs(prevJobs => [newJob, ...prevJobs]);
      return newJob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update a job
  const updateJob = useCallback(async (jobId: number, jobData: JobUpdate): Promise<Job> => {
    try {
      setError(null);
      const updatedJob = await jobsService.updateJob(jobId, jobData);
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === jobId ? updatedJob : job)
      );
      return updatedJob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete a job
  const deleteJob = useCallback(async (jobId: number): Promise<void> => {
    try {
      setError(null);
      await jobsService.deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Bulk update jobs
  const bulkUpdateJobs = useCallback(async (bulkData: JobBulkUpdate): Promise<void> => {
    try {
      setError(null);
      await jobsService.bulkUpdateJobs(bulkData);
      // Refresh jobs to get updated data
      await fetchJobs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk update jobs';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchJobs]);

  // Add contact to a job
  const addContact = useCallback(async (jobId: number, contactData: ContactCreate): Promise<void> => {
    try {
      setError(null);
      const newContact = await jobsService.addContact(jobId, contactData);
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, contacts: [...job.contacts, newContact] }
            : job
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contact';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update contact
  const updateContact = useCallback(async (jobId: number, contactId: number, contactData: Partial<ContactCreate>): Promise<void> => {
    try {
      setError(null);
      const updatedContact = await jobsService.updateContact(jobId, contactId, contactData);
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                contacts: job.contacts.map(contact => 
                  contact.id === contactId ? updatedContact : contact
                )
              }
            : job
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contact';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete contact
  const deleteContact = useCallback(async (jobId: number, contactId: number): Promise<void> => {
    try {
      setError(null);
      await jobsService.deleteContact(jobId, contactId);
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { 
                ...job, 
                contacts: job.contacts.filter(contact => contact.id !== contactId)
              }
            : job
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contact';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Utility functions
  const getJobsByStatus = useCallback((status: string): Job[] => {
    return jobs?.filter(job => job.status === status) || [];
  }, [jobs]);

  const getJobById = useCallback((jobId: number): Job | undefined => {
    return jobs?.find(job => job.id === jobId);
  }, [jobs]);

  // Load data on mount
  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [fetchJobs, fetchStats]);

  return {
    // Data
    jobs,
    jobStats,
    
    // Loading states
    loading,
    statsLoading,
    
    // Error states
    error,
    statsError,
    
    // Actions
    createJob,
    updateJob,
    deleteJob,
    bulkUpdateJobs,
    refreshJobs: fetchJobs,
    refreshStats: fetchStats,
    
    // Contact actions
    addContact,
    updateContact,
    deleteContact,
    
    // Utility functions
    getJobsByStatus,
    getJobById,
  };
}
