import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { ConfidenceLevel } from '../types';
import Toast from '../components/Toast/Toast';
import { useToast } from '../hooks/useToast';
import './TodayReview.css';

interface MarkDoneModalProps {
  problemId: string;
  problemName: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const MarkDoneModal: React.FC<MarkDoneModalProps> = ({
  problemId,
  problemName,
  onClose,
  onSuccess,
}) => {
  const [confidence, setConfidence] = useState<ConfidenceLevel>('medium');
  const [duration, setDuration] = useState<number>(30);
  const queryClient = useQueryClient();

  const markDoneMutation = useMutation({
    mutationFn: () =>
      dashboardApi.markDone({
        problemId,
        confidence,
        completedAt: new Date().toISOString(),
        durationSec: duration * 60,
      }),
    onSuccess: (response) => {
      const nextDate = new Date(response.data.nextReminder.scheduledFor);
      onSuccess(
        `练习已记录！下次复习时间：${nextDate.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`
      );
      queryClient.invalidateQueries({ queryKey: ['todayReview'] });
      onClose();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '标记失败，请重试');
    },
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">记录练习</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="label">问题名称</label>
            <div className="problem-name-display">{problemName}</div>
          </div>

          <div className="form-group">
            <label className="label">信心等级</label>
            <div className="confidence-options">
              <button
                className={`confidence-btn confidence-hard ${
                  confidence === 'hard' ? 'active' : ''
                }`}
                onClick={() => setConfidence('hard')}
              >
                <span className="confidence-icon">😰</span>
                <span className="confidence-label">困难</span>
                <span className="confidence-desc">1天后复习</span>
              </button>
              <button
                className={`confidence-btn confidence-medium ${
                  confidence === 'medium' ? 'active' : ''
                }`}
                onClick={() => setConfidence('medium')}
              >
                <span className="confidence-icon">🤔</span>
                <span className="confidence-label">中等</span>
                <span className="confidence-desc">3天后复习</span>
              </button>
              <button
                className={`confidence-btn confidence-easy ${
                  confidence === 'easy' ? 'active' : ''
                }`}
                onClick={() => setConfidence('easy')}
              >
                <span className="confidence-icon">😊</span>
                <span className="confidence-label">简单</span>
                <span className="confidence-desc">7天后复习</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="duration">
              完成时长（分钟）
            </label>
            <input
              id="duration"
              type="number"
              className="input"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
              min="1"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            取消
          </button>
          <button
            className="btn btn-primary"
            onClick={() => markDoneMutation.mutate()}
            disabled={markDoneMutation.isPending}
          >
            {markDoneMutation.isPending ? <div className="spinner"></div> : '确认'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TodayReview: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['todayReview'],
    queryFn: () => dashboardApi.getTodayReview(),
  });

  const items = data?.data.items || [];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="today-review">
      <div className="page-header">
        <h1 className="page-title">今日复习</h1>
        <p className="page-subtitle">
          共有 <strong>{items.length}</strong> 个问题等待复习
        </p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <div className="empty-state-title">太棒了！</div>
          <div className="empty-state-text">今天没有需要复习的问题</div>
        </div>
      ) : (
        <div className="review-list">
          {items.map((item, index) => (
            <div key={item.problem.id} className="review-card">
              <div className="review-card-header">
                <div className="review-card-number">#{index + 1}</div>
                <span className={`badge badge-${item.problem.status}`}>
                  {item.problem.status === 'todo' && '待开始'}
                  {item.problem.status === 'in_progress' && '进行中'}
                  {item.problem.status === 'done' && '已完成'}
                </span>
              </div>

              <h3 className="review-card-title">{item.problem.name}</h3>

              <div className="review-card-meta">
                <div className="meta-item">
                  <span className="meta-label">评分:</span>
                  <span className="meta-value">
                    {'⭐'.repeat(item.problem.rating)}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">截止:</span>
                  <span className="meta-value">
                    {new Date(item.problem.deadline).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                {item.reminder && (
                  <div className="meta-item">
                    <span className="meta-label">计划复习:</span>
                    <span className="meta-value">
                      {new Date(item.reminder.scheduledFor).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
              </div>

              {item.problem.notes && (
                <div className="review-card-notes">
                  <strong>笔记:</strong> {item.problem.notes}
                </div>
              )}

              <div className="review-card-actions">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setSelectedProblem({
                      id: item.problem.id,
                      name: item.problem.name,
                    })
                  }
                >
                  我已练习
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProblem && (
        <MarkDoneModal
          problemId={selectedProblem.id}
          problemName={selectedProblem.name}
          onClose={() => setSelectedProblem(null)}
          onSuccess={(message) => showToast(message, 'success')}
        />
      )}

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

export default TodayReview;

