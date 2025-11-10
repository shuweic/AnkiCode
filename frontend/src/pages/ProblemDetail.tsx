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
      showToast('Problem deleted', 'success');
      navigate('/problems');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
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
        `Practice recorded! Next review: ${nextDate.toLocaleDateString('en-US', {
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
      showToast(error.response?.data?.message || 'Failed to mark complete', 'error');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
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
        <div className="empty-state-title">Problem Not Found</div>
        <button className="btn btn-primary" onClick={() => navigate('/problems')}>
          Back to Problems
        </button>
      </div>
    );
  }

  return (
    <div className="problem-detail">
      <div className="detail-header">
        <button className="btn btn-outline" onClick={() => navigate('/problems')}>
          ← Back
        </button>

        <div className="detail-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowMarkDone(true)}
            disabled={problem.status === 'done'}
          >
            I've Practiced
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/problems/${id}/edit`)}
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-title-section">
            <h1 className="detail-title">{problem.name}</h1>
            <span className={`badge badge-${problem.status}`}>
              {problem.status === 'todo' && 'To Start'}
              {problem.status === 'in_progress' && 'In Progress'}
              {problem.status === 'done' && 'Completed'}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <div className="info-label">Rating</div>
              <div className="info-value">{'⭐'.repeat(problem.rating)}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Deadline</div>
              <div className="info-value">
                {new Date(problem.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            {problem.lastPracticedAt && (
              <div className="info-item">
                <div className="info-label">Last Practiced</div>
                <div className="info-value">
                  {new Date(problem.lastPracticedAt).toLocaleDateString('en-US')}
                </div>
              </div>
            )}
            <div className="info-item">
              <div className="info-label">Created</div>
              <div className="info-value">
                {new Date(problem.createdAt!).toLocaleDateString('en-US')}
              </div>
            </div>
          </div>

          {problem.notes && (
            <div className="detail-section">
              <h2 className="section-title">Notes</h2>
              <div className="notes-content">{problem.notes}</div>
            </div>
          )}

          {problem.tags && problem.tags.length > 0 && (
            <div className="detail-section">
              <h2 className="section-title">Tags</h2>
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
              <h2 className="section-title">Practice History</h2>
              <div className="history-list">
                {problem.confidenceHistory.map((entry, index) => (
                  <div key={index} className="history-item">
                    <div className="history-date">
                      {new Date(entry.date).toLocaleDateString('en-US')}
                    </div>
                    <span className={`badge badge-${entry.level}`}>
                      {entry.level === 'hard' && 'Hard'}
                      {entry.level === 'medium' && 'Medium'}
                      {entry.level === 'easy' && 'Easy'}
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
              <h2 className="modal-title">Record Practice</h2>
              <button className="modal-close" onClick={() => setShowMarkDone(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="label">Confidence Level</label>
                <div className="confidence-options">
                  <button
                    className={`confidence-btn confidence-hard ${
                      confidence === 'hard' ? 'active' : ''
                    }`}
                    onClick={() => setConfidence('hard')}
                  >
                    <span className="confidence-icon">😰</span>
                    <span className="confidence-label">Hard</span>
                    <span className="confidence-desc">Review in 1 day</span>
                  </button>
                  <button
                    className={`confidence-btn confidence-medium ${
                      confidence === 'medium' ? 'active' : ''
                    }`}
                    onClick={() => setConfidence('medium')}
                  >
                    <span className="confidence-icon">🤔</span>
                    <span className="confidence-label">Medium</span>
                    <span className="confidence-desc">Review in 3 days</span>
                  </button>
                  <button
                    className={`confidence-btn confidence-easy ${
                      confidence === 'easy' ? 'active' : ''
                    }`}
                    onClick={() => setConfidence('easy')}
                  >
                    <span className="confidence-icon">😊</span>
                    <span className="confidence-label">Easy</span>
                    <span className="confidence-desc">Review in 7 days</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="duration">
                  Duration (minutes)
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
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => markDoneMutation.mutate()}
                disabled={markDoneMutation.isPending}
              >
                {markDoneMutation.isPending ? <div className="spinner"></div> : 'Confirm'}
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
