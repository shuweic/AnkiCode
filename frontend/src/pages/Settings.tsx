import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast/Toast';
import { useToast } from '../hooks/useToast';
import './Settings.css';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toasts, showToast, removeToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getSettings(),
  });

  const [notificationsOptIn, setNotificationsOptIn] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState('');

  useEffect(() => {
    if (data?.data) {
      setNotificationsOptIn(data.data.notifications.optIn);
    }
    if (user?.notificationEmail) {
      setNotificationEmail(user.notificationEmail);
      setEmailInputValue(user.notificationEmail);
    } else if (user?.email) {
      setNotificationEmail(user.email);
      setEmailInputValue(user.email);
    }
  }, [data, user]);

  const updateNotificationsMutation = useMutation({
    mutationFn: (optIn: boolean) => settingsApi.updateNotifications(optIn),
    onSuccess: () => {
      showToast('Notification settings updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Update failed', 'error');
    },
  });

  const updateNotificationEmailMutation = useMutation({
    mutationFn: (email: string) => settingsApi.updateNotificationEmail(email),
    onSuccess: (response) => {
      showToast('Notification email updated', 'success');
      setNotificationEmail(response.data.notificationEmail);
      setIsEditingEmail(false);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      // Update user in auth context
      if (user) {
        const updatedUser = { ...user, notificationEmail: response.data.notificationEmail };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Update failed', 'error');
    },
  });

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsOptIn(checked);
    updateNotificationsMutation.mutate(checked);
  };

  const handleEmailEdit = () => {
    setIsEditingEmail(true);
    setEmailInputValue(notificationEmail);
  };

  const handleEmailSave = () => {
    if (emailInputValue.trim() && emailInputValue !== notificationEmail) {
      updateNotificationEmailMutation.mutate(emailInputValue.trim());
    } else {
      setIsEditingEmail(false);
    }
  };

  const handleEmailCancel = () => {
    setIsEditingEmail(false);
    setEmailInputValue(notificationEmail);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <div className="settings-card">
            <h2 className="settings-card-title">Account Information</h2>
            
            <div className="settings-item">
              <div className="settings-item-label">Name</div>
              <div className="settings-item-value">{user?.name}</div>
            </div>

            <div className="settings-item">
              <div className="settings-item-label">Email</div>
              <div className="settings-item-value">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-card">
            <h2 className="settings-card-title">Notification Settings</h2>
            
            <div className="settings-item">
              <div className="settings-item-info">
                <div className="settings-item-label">Notification Email</div>
                <div className="settings-item-description">
                  Email address where reminder notifications will be sent
                </div>
              </div>
              
              {isEditingEmail ? (
                <div className="settings-email-edit">
                  <input
                    type="email"
                    value={emailInputValue}
                    onChange={(e) => setEmailInputValue(e.target.value)}
                    className="settings-email-input"
                    disabled={updateNotificationEmailMutation.isPending}
                  />
                  <div className="settings-email-actions">
                    <button
                      onClick={handleEmailSave}
                      className="settings-email-btn settings-email-btn-save"
                      disabled={updateNotificationEmailMutation.isPending}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEmailCancel}
                      className="settings-email-btn settings-email-btn-cancel"
                      disabled={updateNotificationEmailMutation.isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="settings-email-display">
                  <span className="settings-item-value">{notificationEmail || user?.email}</span>
                  <button
                    onClick={handleEmailEdit}
                    className="settings-email-edit-btn"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <div className="settings-item-label">Receive Review Reminders</div>
                <div className="settings-item-description">
                  The system will send you notifications when problems are due for review
                </div>
              </div>
              
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notificationsOptIn}
                  onChange={(e) => handleNotificationsChange(e.target.checked)}
                  disabled={updateNotificationsMutation.isPending}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-card">
            <h2 className="settings-card-title">About</h2>
            
            <div className="settings-item">
              <div className="settings-item-label">Version</div>
              <div className="settings-item-value">1.0.0</div>
            </div>

            <div className="settings-item">
              <div className="settings-item-label">System</div>
              <div className="settings-item-value">Review Scheduler</div>
            </div>
          </div>
        </div>
      </div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Settings;
