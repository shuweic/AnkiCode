import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { remindersApi } from '../api/reminders';
import { problemsApi } from '../api/problems';
import './Reminders.css';

const STORAGE_KEY = 'reminders-only-pending';

const Reminders: React.FC = () => {
  const [onlyPending, setOnlyPending] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(onlyPending));
  }, [onlyPending]);

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
      map.set(problem._id || problem.id, problem);
    });
    return map;
  }, [problemsData]);

  const allReminders = remindersData?.data.reminders || [];
  const reminders = useMemo(() => {
    if (!onlyPending) return allReminders;
    return allReminders.filter((r) => r.status === 'pending' || r.status === 'snoozed');
  }, [allReminders, onlyPending]);

  const isLoading = remindersLoading || problemsLoading;

  const getProblem = (problemId: string | any) => {
    const id = typeof problemId === 'string' 
      ? problemId 
      : problemId?._id || problemId?.id;
    return problemMap.get(id);
  };

  const getLeetCodeUrl = (titleSlug: string): string => {
    return `https://leetcode.com/problems/${titleSlug}/`;
  };

  return (
    <div className="reminders">
      <div className="page-header">
        <h1 className="page-title">Reminders</h1>
        <div className="reminders-filter">
          <span className="reminders-filter-label">Only Pending</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={onlyPending}
              onChange={(e) => setOnlyPending(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
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
                <span className="reminder-value">
                  {(() => {
                    const problem = getProblem(reminder.problemId);
                    if (problem?.titleSlug) {
                      return (
                        <a
                          href={getLeetCodeUrl(problem.titleSlug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="reminder-link"
                        >
                          {problem.name || 'Unknown'}
                        </a>
                      );
                    }
                    return problem?.name || 'Unknown';
                  })()}
                </span>
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

