import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { problemsApi } from '../api/problems';
import { dashboardApi } from '../api/dashboard';
import { ConfidenceLevel } from '../types';
import Toast from '../components/Toast/Toast';
import { useToast } from '../hooks/useToast';
import './ProblemDetail.css';

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toasts, showToast, removeToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [showMarkDone, setShowMarkDone] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel>('medium');
  const [duration, setDuration] = useState<number>(30);

  const { data, isLoading } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => problemsApi.getProblemById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => problemsApi.deleteProblem(id!),
    onSuccess: () => {
      showToast('问题已删除', 'success');
      navigate('/problems');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || '删除失败', 'error');
    },
  });

  const markDoneMutation = useMutation({
    mutationFn: () =>
      dashboardApi.markDone({
        problemId: id!,
        confidence,
        completedAt: new Date().toISOString(),
        durationSec: duration * 60,
      }),
    onSuccess: (response) => {
      const nextDate = new Date(response.data.nextReminder.scheduledFor);
      showToast(
        `练习已记录！下次复习时间：${nextDate.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`,
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ['problem', id] });
      setShowMarkDone(false);
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || '标记失败', 'error');
    },
  });

  const handleDelete = () => {
    if (window.confirm('确定要删除这个问题吗？此操作不可撤销。')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const problem = data?.data;

  if (!problem) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">问题未找到</div>
        <button className="btn btn-primary" onClick={() => navigate('/problems')}>
          返回问题列表
        </button>
      </div>
    );
  }

  return (
    <div className="problem-detail">
      <div className="detail-header">
        <button className="btn btn-outline" onClick={() => navigate('/problems')}>
          ← 返回
        </button>

        <div className="detail-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowMarkDone(true)}
            disabled={problem.status === 'done'}
          >
            我已练习
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/problems/${id}/edit`)}
          >
            编辑
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            删除
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-title-section">
            <h1 className="detail-title">{problem.name}</h1>
            <span className={`badge badge-${problem.status}`}>
              {problem.status === 'todo' && '待开始'}
              {problem.status === 'in_progress' && '进行中'}
              {problem.status === 'done' && '已完成'}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <div className="info-label">评分</div>
              <div className="info-value">{'⭐'.repeat(problem.rating)}</div>
            </div>
            <div className="info-item">
              <div className="info-label">截止日期</div>
              <div className="info-value">
                {new Date(problem.deadline).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            {problem.lastPracticedAt && (
              <div className="info-item">
                <div className="info-label">最后练习</div>
                <div className="info-value">
                  {new Date(problem.lastPracticedAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            )}
            <div className="info-item">
              <div className="info-label">创建时间</div>
              <div className="info-value">
                {new Date(problem.createdAt!).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>

          {problem.notes && (
            <div className="detail-section">
              <h2 className="section-title">笔记</h2>
              <div className="notes-content">{problem.notes}</div>
            </div>
          )}

          {problem.tags && problem.tags.length > 0 && (
            <div className="detail-section">
              <h2 className="section-title">标签</h2>
              <div className="tags-list">
                {problem.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {problem.confidenceHistory && problem.confidenceHistory.length > 0 && (
            <div className="detail-section">
              <h2 className="section-title">练习历史</h2>
              <div className="history-list">
                {problem.confidenceHistory.map((entry, index) => (
                  <div key={index} className="history-item">
                    <div className="history-date">
                      {new Date(entry.date).toLocaleDateString('zh-CN')}
                    </div>
                    <span className={`badge badge-${entry.level}`}>
                      {entry.level === 'hard' && '困难'}
                      {entry.level === 'medium' && '中等'}
                      {entry.level === 'easy' && '简单'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showMarkDone && (
        <div className="modal-overlay" onClick={() => setShowMarkDone(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">记录练习</h2>
              <button className="modal-close" onClick={() => setShowMarkDone(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
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
              <button className="btn btn-outline" onClick={() => setShowMarkDone(false)}>
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

export default ProblemDetail;

