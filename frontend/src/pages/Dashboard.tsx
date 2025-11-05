import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import { problemsApi } from '../api/problems';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ['todayReview'],
    queryFn: () => dashboardApi.getTodayReview(),
  });

  const { data: problemsData, isLoading: problemsLoading } = useQuery({
    queryKey: ['problems', 'recent'],
    queryFn: () => problemsApi.getProblems({ limit: 5, sort: '-updatedAt' }),
  });

  const todayCount = todayData?.data.count || 0;
  const problems = problemsData?.data.problems || [];

  // 统计数据
  const todoCount = problems.filter((p) => p.status === 'todo').length;
  const inProgressCount = problems.filter((p) => p.status === 'in_progress').length;
  const doneCount = problems.filter((p) => p.status === 'done').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">欢迎回来！这是您的学习概览</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-label">今日待复习</div>
            <div className="stat-value">{todayCount}</div>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-label">待开始</div>
            <div className="stat-value">{todoCount}</div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-label">进行中</div>
            <div className="stat-value">{inProgressCount}</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">已完成</div>
            <div className="stat-value">{doneCount}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">今日复习</h2>
            <Link to="/dashboard/today" className="section-link">
              查看全部 →
            </Link>
          </div>

          {todayLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : todayCount > 0 ? (
            <div className="dashboard-card">
              <p className="dashboard-info">
                您今天有 <strong>{todayCount}</strong> 个问题需要复习
              </p>
              <Link to="/dashboard/today" className="btn btn-primary">
                开始复习
              </Link>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <div className="empty-state-title">太棒了！</div>
              <div className="empty-state-text">今天没有需要复习的问题</div>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">最近更新的问题</h2>
            <Link to="/problems" className="section-link">
              查看全部 →
            </Link>
          </div>

          {problemsLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : problems.length > 0 ? (
            <div className="recent-problems">
              {problems.map((problem) => (
                <Link
                  key={problem._id || problem.id}
                  to={`/problems/${problem._id || problem.id}`}
                  className="problem-item"
                >
                  <div className="problem-info">
                    <div className="problem-name">
                      <span className="problem-number">#{problem.leetcodeId}</span>
                      {problem.name}
                    </div>
                    <div className="problem-meta">
                      {problem.difficulty} · 截止: {new Date(problem.deadline).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <span className={`badge badge-${problem.status} problem-status`}>
                    {problem.status === 'todo' && '待开始'}
                    {problem.status === 'in_progress' && '进行中'}
                    {problem.status === 'done' && '已完成'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">暂无问题</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

