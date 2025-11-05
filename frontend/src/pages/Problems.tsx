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
        <h1 className="page-title">LeetCode 复习列表</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✖ 取消' : '+ 添加题目'}
        </button>
      </div>

      {/* 添加题目表单 */}
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
            placeholder="搜索问题名称或笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select
            className="input filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProblemStatus | '')}
          >
            <option value="">全部状态</option>
            <option value="todo">待开始</option>
            <option value="in_progress">进行中</option>
            <option value="done">已完成</option>
          </select>

          <select
            className="input filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="deadline">按截止日期</option>
            <option value="-updatedAt">按更新时间</option>
            <option value="rating">按评分</option>
            <option value="name">按名称</option>
          </select>

          <button type="submit" className="btn btn-primary">
            搜索
          </button>
          
          <button type="button" className="btn btn-outline" onClick={handleReset}>
            重置
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
          <div className="empty-state-title">暂无问题</div>
          <div className="empty-state-text">
            {searchQuery || statusFilter
              ? '没有找到符合条件的问题'
              : '开始添加您的第一个问题吧！'}
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
                    {problem.status === 'todo' && '待开始'}
                    {problem.status === 'in_progress' && '进行中'}
                    {problem.status === 'done' && '已完成'}
                  </span>
                </div>

                <div className="problem-card-meta">
                  <div className="meta-item">
                    <span className="meta-label">难度:</span>
                    <span className={`difficulty-badge difficulty-${problem.difficulty?.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">截止:</span>
                    <span className="meta-value">
                      {new Date(problem.deadline).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  {problem.lastPracticedAt && (
                    <div className="meta-item">
                      <span className="meta-label">最后练习:</span>
                      <span className="meta-value">
                        {new Date(problem.lastPracticedAt).toLocaleDateString('zh-CN')}
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
                上一页
              </button>
              
              <span className="pagination-info">
                第 {page} 页，共 {pagination.pages} 页
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
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Problems;

