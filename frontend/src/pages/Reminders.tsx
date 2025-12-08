import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { remindersApi } from '../api/reminders';
import { problemsApi } from '../api/problems';
import './Reminders.css';

const Reminders: React.FC = () => {
  const { data: remindersData, isLoading: remindersLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => remindersApi.getReminders(),
  });

  const { data: problemsData, isLoading: problemsLoading } = useQuery({
    queryKey: ['problems', 'all'],
    queryFn: () => problemsApi.getProblems({ limit: 1000 }),
  });

  const problemMap = useMemo(() => {
    const map = new Map();
    problemsData?.data.problems.forEach((problem) => {
      map.set(problem._id || problem.id, problem.name);
    });
    return map;
  }, [problemsData]);

  const reminders = remindersData?.data.reminders || [];
  const isLoading = remindersLoading || problemsLoading;

  const getProblemName = (problemId: string | any): string => {
    const id = typeof problemId === 'string' 
      ? problemId 
      : problemId?._id || problemId?.id;
    return problemMap.get(id) || 'Unknown';
  };

  return (
    <div className="reminders">
      <div className="page-header">
        <h1 className="page-title">Reminders</h1>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : reminders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <div className="empty-state-title">No Reminders</div>
          <div className="empty-state-text">You don't have any reminders yet</div>
        </div>
      ) : (
        <div className="reminders-list">
          {reminders.map((reminder) => (
            <div key={reminder._id || reminder.id} className="reminder-item">
              <div className="reminder-field">
                <span className="reminder-label">Problem Name:</span>
                <span className="reminder-value">{getProblemName(reminder.problemId)}</span>
              </div>
              <div className="reminder-field">
                <span className="reminder-label">Scheduled For:</span>
                <span className="reminder-value">
                  {new Date(reminder.scheduledFor).toLocaleString('en-US')}
                </span>
              </div>
              <div className="reminder-field">
                <span className="reminder-label">Created At:</span>
                <span className="reminder-value">
                  {reminder.createdAt ? new Date(reminder.createdAt).toLocaleString('en-US') : 'N/A'}
                </span>
              </div>
              <div className="reminder-field">
                <span className="reminder-label">Created From:</span>
                <span className="reminder-value">{reminder.createdFrom || 'N/A'}</span>
              </div>
              <div className="reminder-field">
                <span className="reminder-label">Status:</span>
                <span className="reminder-value">{reminder.status || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reminders;

