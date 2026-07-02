import { useState, useEffect, useCallback } from 'react';
import { sampleCandidates } from './sample-data';

const STORAGE_KEY = 'booster-candidates-v1';

// デモ用の「今日」。サンプルデータの日付と整合させるため固定
export const DEMO_TODAY = '2026-06-25';

export function useCandidates() {
  const [candidates, setCandidates] = useState(sampleCandidates);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCandidates(JSON.parse(raw));
    } catch (e) {
      // localStorage不可の環境ではサンプルデータのまま動作
    }
  }, []);

  const persist = useCallback((updater) => {
    setCandidates(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) { /* noop */ }
      return next;
    });
  }, []);

  const updateCandidate = useCallback((id, patch) => {
    persist(prev => prev.map(c =>
      c.id === id ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c
    ));
  }, [persist]);

  // ステータスを進めて選考履歴に記録する
  const advanceStatus = useCallback((id, status, note, extra = {}) => {
    updateCandidate(id, c => ({
      status,
      ...extra,
      statusHistory: [...(c.statusHistory || []), { status, date: DEMO_TODAY, note }],
    }));
  }, [updateCandidate]);

  const addCandidate = useCallback((candidate) => {
    persist(prev => [...prev, candidate]);
  }, [persist]);

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* noop */ }
    setCandidates(sampleCandidates);
  }, []);

  return { candidates, updateCandidate, advanceStatus, addCandidate, resetDemo };
}
