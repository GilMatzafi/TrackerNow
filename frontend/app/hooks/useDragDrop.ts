import { useState, useCallback } from 'react';
import { JobStatus, DragDropState } from '../types/job';

export const useDragDrop = () => {
  const [dragState, setDragState] = useState<DragDropState>({
    draggedColumnIndex: null,
    dragOverIndex: null,
    draggedJobId: null,
    jobDropZone: null,
  });

  const handleColumnDragStart = useCallback((e: React.DragEvent, columnIndex: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragState(prev => ({
      ...prev,
      draggedColumnIndex: columnIndex,
    }));
  }, []);

  const handleColumnDragEnd = useCallback(() => {
    setDragState({
      draggedColumnIndex: null,
      dragOverIndex: null,
      draggedJobId: null,
      jobDropZone: null,
    });
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState(prev => ({
      ...prev,
      dragOverIndex: targetIndex,
    }));
  }, []);

  const handleColumnDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      dragOverIndex: null,
    }));
  }, []);

  const handleJobDragStart = useCallback((e: React.DragEvent, jobId: number) => {
    e.dataTransfer.setData('text/plain', jobId.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDragState(prev => ({
      ...prev,
      draggedJobId: jobId,
    }));
  }, []);

  const handleJobDragOver = useCallback((e: React.DragEvent, columnId: JobStatus, position: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState(prev => ({
      ...prev,
      jobDropZone: { columnId, position },
    }));
  }, []);

  const handleJobDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      jobDropZone: null,
    }));
  }, []);

  const resetDragState = useCallback(() => {
    setDragState({
      draggedColumnIndex: null,
      dragOverIndex: null,
      draggedJobId: null,
      jobDropZone: null,
    });
  }, []);

  return {
    dragState,
    handleColumnDragStart,
    handleColumnDragEnd,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleJobDragStart,
    handleJobDragOver,
    handleJobDragLeave,
    resetDragState,
  };
};
