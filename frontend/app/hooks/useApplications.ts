import { useState, useEffect } from 'react';
import { Application, ApplicationFormData } from '../types/application';
import { applicationsService } from '../services';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsService.getApplications();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async (applicationData: ApplicationFormData): Promise<boolean> => {
    try {
      setError(null);
      const newApplication = await applicationsService.createApplication(applicationData);
      setApplications(prev => [...prev, newApplication]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add application');
      return false;
    }
  };

  const updateApplication = async (id: number, applicationData: Partial<ApplicationFormData>): Promise<boolean> => {
    try {
      setError(null);
      const updatedApplication = await applicationsService.updateApplication(id, applicationData);
      setApplications(prev => prev.map(app => 
        app.id === id ? updatedApplication : app
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
      return false;
    }
  };

  const deleteApplication = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await applicationsService.deleteApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
      return false;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications
  };
};
