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

  useEffect(() => {
    if (data?.data) {
      setNotificationsOptIn(data.data.notifications.optIn);
    }
  }, [data]);

  const updateNotificationsMutation = useMutation({
    mutationFn: (optIn: boolean) => settingsApi.updateNotifications(optIn),
    onSuccess: () => {
      showToast('通知设置已更新', 'success');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || '更新失败', 'error');
    },
  });

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsOptIn(checked);
    updateNotificationsMutation.mutate(checked);
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
        <h1 className="page-title">设置</h1>
        <p className="page-subtitle">管理您的账户和偏好设置</p>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <div className="settings-card">
            <h2 className="settings-card-title">账户信息</h2>
            
            <div className="settings-item">
              <div className="settings-item-label">姓名</div>
              <div className="settings-item-value">{user?.name}</div>
            </div>

            <div className="settings-item">
              <div className="settings-item-label">邮箱</div>
              <div className="settings-item-value">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-card">
            <h2 className="settings-card-title">通知设置</h2>
            
            <div className="settings-item">
              <div className="settings-item-info">
                <div className="settings-item-label">接收复习提醒</div>
                <div className="settings-item-description">
                  当有问题需要复习时，系统将向您发送通知
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
            <h2 className="settings-card-title">关于</h2>
            
            <div className="settings-item">
              <div className="settings-item-label">版本</div>
              <div className="settings-item-value">1.0.0</div>
            </div>

            <div className="settings-item">
              <div className="settings-item-label">系统</div>
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

