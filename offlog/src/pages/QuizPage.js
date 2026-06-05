import React, { useState } from 'react';
import questions from '../data/questions';
import './QuizPage.css';

const BILL_FIELDS = [
  { key: 'electricity', label: '⚡ 전기', usageUnit: 'kWh' },
  { key: 'water', label: '💧 수도', usageUnit: 'm³' },
  { key: 'gas', label: '🔥 가스', usageUnit: 'm³' },
];

function QuizPage({ onComplete, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [billData, setBillData] = useState({
    electricity: { fee: '', usage: '' },
    water: { fee: '', usage: '' },
    gas: { fee: '', usage: '' },
  });

  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[question.id];

  const canProceed = () => {
    if (question.type === 'single') return currentAnswer !== undefined;
    if (question.type === 'multi') return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    return true;
  };

  const handleSingleSelect = (idx) => {
    setAnswers((prev) => ({ ...prev, [question.id]: idx }));
  };

  const handleMultiToggle = (idx) => {
    setAnswers((prev) => {
      const curr = Array.isArray(prev[question.id]) ? prev[question.id] : [];
      const next = curr.includes(idx) ? curr.filter((i) => i !== idx) : [...curr, idx];
      return { ...prev, [question.id]: next };
    });
  };

  const handleBillChange = (category, field, value) => {
    setBillData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (isLast) {
      onComplete({ ...answers, bill: billData });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="btn-back-header" onClick={handlePrev}>‹</button>
        <div className="progress-area">
          <span className="progress-label">{currentIndex + 1}/{questions.length}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="quiz-body">
        <h2 className="question-text" style={{ whiteSpace: 'pre-line' }}>
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="question-subtitle">{question.subtitle}</p>
        )}

        {question.type === 'single' && (
          <div className="options-single">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-single ${currentAnswer === idx ? 'selected' : ''}`}
                onClick={() => handleSingleSelect(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multi' && (
          <div className="options-multi">
            {question.options.map((opt, idx) => {
              const selected = Array.isArray(currentAnswer) && currentAnswer.includes(idx);
              return (
                <button
                  key={idx}
                  className={`option-multi ${selected ? 'selected' : ''}`}
                  onClick={() => handleMultiToggle(idx)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'bill' && (
          <div className="bill-section">
            {BILL_FIELDS.map(({ key, label, usageUnit }) => (
              <div key={key} className="bill-card">
                <p className="bill-card-label">{label}</p>
                <div className="bill-row">
                  <span className="bill-field-label">요금</span>
                  <input
                    type="number"
                    className="bill-input"
                    value={billData[key].fee}
                    onChange={(e) => handleBillChange(key, 'fee', e.target.value)}
                  />
                  <span className="bill-unit">원</span>
                  <span className="bill-field-label">사용량</span>
                  <input
                    type="number"
                    className="bill-input"
                    value={billData[key].usage}
                    onChange={(e) => handleBillChange(key, 'usage', e.target.value)}
                  />
                  <span className="bill-unit">{usageUnit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`quiz-footer ${isFirst ? 'single-btn' : 'double-btn'}`}>
        {!isFirst && (
          <button className="btn-prev" onClick={handlePrev}>
            이전
          </button>
        )}
        <button
          className={`btn-next ${canProceed() ? 'active' : ''}`}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {isLast ? '결과 확인하기' : '다음으로'}
        </button>
      </div>
    </div>
  );
}

export default QuizPage;
