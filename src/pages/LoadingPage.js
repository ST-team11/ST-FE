import React, { useEffect } from 'react';
import { buildAssessmentPayload } from '../utils/mapAnswers';
import { calculateResult } from '../utils/calculate';
import './LoadingPage.css';

const MIN_DURATION = 1800;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function LoadingPage({ quizData, onComplete, onError }) {
  useEffect(() => {
    let cancelled = false;

    async function evaluate() {
      try {
        const payload = buildAssessmentPayload(quizData);
        const [result] = await Promise.all([
          Promise.resolve(calculateResult(quizData.answers)),
          delay(MIN_DURATION),
        ]);
        if (!cancelled) onComplete(result, payload);
      } catch (error) {
        if (!cancelled) onError(error.message);
      }
    }

    evaluate();
    return () => {
      cancelled = true;
    };
  }, [quizData, onComplete, onError]);

  return (
    <div className="loading-page">
      <div className="loading-spinner" />
      <p className="loading-title">에너지 습관을 분석하는 중...</p>
      <p className="loading-subtitle">잠시만 기다려 주세요</p>
    </div>
  );
}

export default LoadingPage;
