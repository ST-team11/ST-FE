import React, { useEffect } from 'react';
import { calculateResult } from '../utils/calculate';
import './LoadingPage.css';

function LoadingPage({ answers, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = calculateResult(answers);
      onComplete(result);
    }, 2500);
    return () => clearTimeout(timer);
  }, [answers, onComplete]);

  return (
    <div className="loading-page">
      <div className="loading-spinner" />
      <p className="loading-title">에너지 습관을 분석하는 중...</p>
      <p className="loading-subtitle">잠시만 기다려 주세요</p>
    </div>
  );
}

export default LoadingPage;
