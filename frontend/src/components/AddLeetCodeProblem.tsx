import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { problemsApi } from '../api/problems';
import './AddLeetCodeProblem.css';

interface AddLeetCodeProblemProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddLeetCodeProblem: React.FC<AddLeetCodeProblemProps> = ({ onSuccess, onCancel }) => {
  // 生成默认截止日期（7天后）
  const getDefaultDeadline = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [leetcodeId, setLeetcodeId] = useState('');
  const [deadline, setDeadline] = useState(getDefaultDeadline()); // 初始化为默认日期
  const [notes, setNotes] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const queryClient = useQueryClient();

  // 搜索 LeetCode 题目（预览）
  const handleSearch = async () => {
    const qid = parseInt(leetcodeId, 10);
    if (!qid || qid <= 0) {
      setSearchError('请输入有效的题号');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setPreviewData(null);

    try {
      const response = await problemsApi.searchLeetCode(qid);
      setPreviewData(response.data);
    } catch (error: any) {
      setSearchError(error.response?.data?.message || '题目未找到');
    } finally {
      setIsSearching(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: () =>
      problemsApi.createProblem({
        leetcodeId: parseInt(leetcodeId, 10),
        deadline: new Date(deadline).toISOString(),
        notes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      if (onSuccess) onSuccess();
      // 重置表单
      setLeetcodeId('');
      setDeadline(getDefaultDeadline());
      setNotes('');
      setPreviewData(null);
    },
    onError: (error: any) => {
      setSearchError(error.response?.data?.message || '添加失败');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leetcodeId || !deadline) {
      setSearchError('请填写题号和截止日期');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="add-leetcode-problem">
      <h2 className="add-problem-title">📚 添加 LeetCode 题目</h2>

      <form onSubmit={handleSubmit} className="add-problem-form">
        {/* 题号输入 + 搜索按钮 */}
        <div className="form-group">
          <label className="label" htmlFor="leetcodeId">
            LeetCode 题号 *
          </label>
          <div className="search-input-group">
            <input
              id="leetcodeId"
              type="number"
              className="input"
              value={leetcodeId}
              onChange={(e) => {
                setLeetcodeId(e.target.value);
                setPreviewData(null);
                setSearchError('');
              }}
              placeholder="例如: 1, 15, 206..."
              min="1"
              required
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSearch}
              disabled={!leetcodeId || isSearching}
            >
              {isSearching ? '搜索中...' : '🔍 预览'}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {searchError && <div className="error-message">{searchError}</div>}

        {/* 题目预览 */}
        {previewData && (
          <div className="problem-preview">
            <h3 className="preview-title">
              #{previewData.leetcodeId} - {previewData.title}
            </h3>
            <div className="preview-info">
              <span className={`difficulty-badge difficulty-${previewData.difficulty.toLowerCase()}`}>
                {previewData.difficulty}
              </span>
              <div className="preview-tags">
                {previewData.tags?.slice(0, 3).map((tag: string, index: number) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 截止日期 */}
        <div className="form-group">
          <label className="label" htmlFor="deadline">
            截止日期 *
          </label>
          <input
            id="deadline"
            type="date"
            className="input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        {/* 笔记（可选） */}
        <div className="form-group">
          <label className="label" htmlFor="notes">
            笔记（可选）
          </label>
          <textarea
            id="notes"
            className="input textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="添加你的学习笔记..."
            rows={3}
          />
        </div>

        {/* 按钮组 */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              取消
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending || !leetcodeId || !deadline}
          >
            {createMutation.isPending ? (
              <>
                <div className="spinner"></div>
                添加中...
              </>
            ) : (
              '✅ 添加到我的列表'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeetCodeProblem;

