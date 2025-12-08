import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { remindersApi } from '../api/reminders';
import './Reminders.css';

const Reminders: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => remindersApi.getReminders(),
  });

  const reminders = data?.data.reminders || [];

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
          {reminders.map((reminder) => {
            const problemId = typeof reminder.problemId === 'string' 
              ? reminder.problemId 
              : reminder.problemId?._id || reminder.problemId?.id || 'N/A';
            
            return (
              <div key={reminder._id || reminder.id} className="reminder-item">
                <div className="reminder-field">
                  <span className="reminder-label">Problem ID:</span>
                  <span className="reminder-value">{problemId}</span>
                </div>
                <div className="reminder-field">
                  <span className="reminder-label">Scheduled For:</span>
                  <span className="reminder-value">
                    {new Date(reminder.scheduledFor).toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reminders;

