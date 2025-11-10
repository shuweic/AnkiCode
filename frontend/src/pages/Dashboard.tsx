import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Rocket, CheckCircle, PartyPopper } from 'lucide-react';
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

  // Statistics
  const todoCount = problems.filter((p) => p.status === 'todo').length;
  const inProgressCount = problems.filter((p) => p.status === 'in_progress').length;
  const doneCount = problems.filter((p) => p.status === 'done').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's your learning overview</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Due Today</div>
            <div className="stat-value">{todayCount}</div>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">To Start</div>
            <div className="stat-value">{todoCount}</div>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <Rocket size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{inProgressCount}</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{doneCount}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Today's Review</h2>
            <Link to="/dashboard/today" className="section-link">
              View All →
            </Link>
          </div>

          {todayLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : todayCount > 0 ? (
            <div className="dashboard-card">
              <p className="dashboard-info">
                You have <strong>{todayCount}</strong> problem(s) to review today
              </p>
              <Link to="/dashboard/today" className="btn btn-primary">
                Start Review
              </Link>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <PartyPopper size={48} />
              </div>
              <div className="empty-state-title">Awesome!</div>
              <div className="empty-state-text">No problems due for review today</div>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recently Updated Problems</h2>
            <Link to="/problems" className="section-link">
              View All →
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
                      {problem.difficulty} · Due: {new Date(problem.deadline).toLocaleDateString('en-US')}
                    </div>
                  </div>
                  <span className={`badge badge-${problem.status} problem-status`}>
                    {problem.status === 'todo' && 'To Start'}
                    {problem.status === 'in_progress' && 'In Progress'}
                    {problem.status === 'done' && 'Completed'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={48} />
              </div>
              <div className="empty-state-text">No problems yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

