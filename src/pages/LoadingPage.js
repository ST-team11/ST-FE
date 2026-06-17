import React, { useEffect } from 'react';
import { buildAssessmentPayload } from '../utils/mapAnswers';
import { submitAssessment } from '../lib/api';
import './LoadingPage.css';

// 스피너 깜빡임 방지용 최소 노출 시간
const MIN_DURATION = 1800;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function LoadingPage({ quizData, onComplete, onError }) {
  useEffect(() => {
    let cancelled = false;

    async function evaluate() {
      try {
        const payload = buildAssessmentPayload(quizData);
        const [result] = await Promise.all([
          submitAssessment(payload),
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
