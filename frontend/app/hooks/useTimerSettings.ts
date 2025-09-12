import { useState, useEffect } from 'react';
import { timerSettingsService, TimerSettings, UpdateTimerSettings } from '../services/timerSettings';

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from backend
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timerSettingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error loading timer settings:', err);
      setError('Failed to load timer settings');
    } finally {
      setLoading(false);
    }
  };

  // Update settings in backend
  const updateSettings = async (updates: UpdateTimerSettings) => {
    try {
      setError(null);
      const updatedSettings = await timerSettingsService.updateSettings(updates);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      console.error('Error updating timer settings:', err);
      setError('Failed to update timer settings');
      throw err;
    }
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: loadSettings
  };
};
