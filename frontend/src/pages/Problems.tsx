import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { problemsApi } from '../api/problems';
import { ProblemStatus } from '../types';
import AddLeetCodeProblem from '../components/AddLeetCodeProblem';
import './Problems.css';

const Problems: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | ''>(
    (searchParams.get('status') as ProblemStatus) || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'deadline');
  
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading } = useQuery({
    queryKey: ['problems', searchQuery, statusFilter, sortBy, page],
    queryFn: () =>
      problemsApi.getProblems({
        q: searchQuery || undefined,
        status: statusFilter || undefined,
        sort: sortBy,
        page,
        limit: 20,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = { page: '1' };
    if (searchQuery) params.q = searchQuery;
    if (statusFilter) params.status = statusFilter;
    if (sortBy !== 'deadline') params.sort = sortBy;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSortBy('deadline');
    setSearchParams({});
  };

  const problems = data?.data.problems || [];
  const pagination = data?.data.pagination;

  return (
    <div className="problems">
      <div className="page-header">
        <h1 className="page-title">LeetCode Review List</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✖ Cancel' : '+ Add Problem'}
        </button>
      </div>

      {/* Add Problem Form */}
      {showAddForm && (
        <AddLeetCodeProblem
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="problems-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="input search-input"
            placeholder="Search problem name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select
            className="input filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProblemStatus | '')}
          >
            <option value="">All Status</option>
            <option value="todo">To Start</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>

          <select
            className="input filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="deadline">By Deadline</option>
            <option value="-updatedAt">By Update Time</option>
            <option value="rating">By Rating</option>
            <option value="name">By Name</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
          
          <button type="button" className="btn btn-outline" onClick={handleReset}>
            Reset
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : problems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">No Problems Found</div>
          <div className="empty-state-text">
            {searchQuery || statusFilter
              ? 'No problems match your criteria'
              : 'Start by adding your first problem!'}
          </div>
        </div>
      ) : (
        <>
          <div className="problems-list">
            {problems.map((problem) => (
              <Link
                key={problem._id || problem.id}
                to={`/problems/${problem._id || problem.id}`}
                className="problem-card"
              >
                <div className="problem-card-header">
                  <div className="problem-title-section">
                    <span className="problem-number">#{problem.leetcodeId}</span>
                    <h3 className="problem-card-title">{problem.name}</h3>
                  </div>
                  <span className={`badge badge-${problem.status}`}>
                    {problem.status === 'todo' && 'To Start'}
                    {problem.status === 'in_progress' && 'In Progress'}
                    {problem.status === 'done' && 'Completed'}
                  </span>
                </div>

                <div className="problem-card-meta">
                  <div className="meta-item">
                    <span className="meta-label">Difficulty:</span>
                    <span className={`difficulty-badge difficulty-${problem.difficulty?.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Due:</span>
                    <span className="meta-value">
                      {new Date(problem.deadline).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  {problem.lastPracticedAt && (
                    <div className="meta-item">
                      <span className="meta-label">Last Practiced:</span>
                      <span className="meta-value">
                        {new Date(problem.lastPracticedAt).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  )}
                </div>

                {problem.notes && (
                  <p className="problem-card-notes">
                    {problem.notes.length > 100
                      ? `${problem.notes.substring(0, 100)}...`
                      : problem.notes}
                  </p>
                )}

                {problem.tags && problem.tags.length > 0 && (
                  <div className="problem-card-tags">
                    {problem.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => {
                  const params = Object.fromEntries(searchParams);
                  params.page = String(page - 1);
                  setSearchParams(params);
                }}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {page} of {pagination.pages}
              </span>
              
              <button
                className="btn btn-outline"
                disabled={page === pagination.pages}
                onClick={() => {
                  const params = Object.fromEntries(searchParams);
                  params.page = String(page + 1);
                  setSearchParams(params);
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Problems;
