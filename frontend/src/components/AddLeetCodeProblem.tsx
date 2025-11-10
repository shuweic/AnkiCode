import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { problemsApi } from '../api/problems';
import './AddLeetCodeProblem.css';

interface AddLeetCodeProblemProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddLeetCodeProblem: React.FC<AddLeetCodeProblemProps> = ({ onSuccess, onCancel }) => {
  // Generate default deadline (7 days from now)
  const getDefaultDeadline = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [leetcodeId, setLeetcodeId] = useState('');
  const [deadline, setDeadline] = useState(getDefaultDeadline()); // Initialize with default date
  const [notes, setNotes] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const queryClient = useQueryClient();

  // Search LeetCode problem (preview)
  const handleSearch = async () => {
    const qid = parseInt(leetcodeId, 10);
    if (!qid || qid <= 0) {
      setSearchError('Please enter a valid problem number');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setPreviewData(null);

    try {
      const response = await problemsApi.searchLeetCode(qid);
      setPreviewData(response.data);
    } catch (error: any) {
      setSearchError(error.response?.data?.message || 'Problem not found');
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
      // Reset form
      setLeetcodeId('');
      setDeadline(getDefaultDeadline());
      setNotes('');
      setPreviewData(null);
    },
    onError: (error: any) => {
      setSearchError(error.response?.data?.message || 'Failed to add problem');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leetcodeId || !deadline) {
      setSearchError('Please fill in problem number and deadline');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="add-leetcode-problem">
      <h2 className="add-problem-title">📚 Add LeetCode Problem</h2>

      <form onSubmit={handleSubmit} className="add-problem-form">
        {/* Problem Number Input + Search Button */}
        <div className="form-group">
          <label className="label" htmlFor="leetcodeId">
            LeetCode Problem Number *
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
              placeholder="e.g., 1, 15, 206..."
              min="1"
              required
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSearch}
              disabled={!leetcodeId || isSearching}
            >
              {isSearching ? 'Searching...' : '🔍 Preview'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {searchError && <div className="error-message">{searchError}</div>}

        {/* Problem Preview */}
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

        {/* Deadline */}
        <div className="form-group">
          <label className="label" htmlFor="deadline">
            Deadline *
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

        {/* Notes (Optional) */}
        <div className="form-group">
          <label className="label" htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            className="input textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your learning notes..."
            rows={3}
          />
        </div>

        {/* Button Group */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
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
                Adding...
              </>
            ) : (
              '✅ Add to My List'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeetCodeProblem;
