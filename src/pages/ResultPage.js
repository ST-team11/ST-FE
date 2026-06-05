import React from 'react';
import './ResultPage.css';

const SCORE_BARS = [
  { key: 'electricity', label: '전기 절약', color: '#F5A623' },
  { key: 'water', label: '수도 절약', color: '#4A90D9' },
  { key: 'gas', label: '가스 절약', color: '#E74C3C' },
  { key: 'consciousness', label: '절약 의식', color: '#2e6b4a' },
];

function ScoreBar({ label, score, color }) {
  return (
    <div className="score-row">
      <span className="score-label">{label}</span>
      <div className="score-track">
        <div
          className="score-fill"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ResultPage({ result, onRestart }) {
  const { type, scores } = result;

  return (
    <div className="result-page">
      <div className="result-body">
        <p className="result-tagline">{type.tagline}</p>
        <h1 className="result-type-name">{type.name}</h1>

        <div className="result-character">{type.character}</div>

        <div className="score-section">
          {SCORE_BARS.map(({ key, label, color }) => (
            <ScoreBar
              key={key}
              label={label}
              score={scores[key]}
              color={color}
            />
          ))}
        </div>

        <hr className="divider" />

        <ul className="trait-list">
          {type.traits.map((trait, i) => (
            <li key={i}>{trait}</li>
          ))}
        </ul>

        <hr className="divider" />

        <div className="tips-section">
          <h3 className="tips-title">이렇게 해보세요!</h3>
          <ul className="tips-list">
            {type.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        <hr className="divider" />

        <div className="action-buttons">
          <button className="btn-action share">
            🧑‍💻 결과 공유하기
          </button>
          <button className="btn-action save-img">
            🖼️ 결과 이미지 저장하기
          </button>
          <button className="btn-action restart" onClick={onRestart}>
            테스트 다시하기
          </button>
        </div>

        <hr className="divider" />

        <p className="social-save-hint">
          로그인하면 내 정보를 저장하고 불러올 수 있어요!
        </p>

        <div className="social-save-buttons">
          <button className="btn-social-save kakao">
            <span className="social-icon">💬</span>
            카카오로 내 정보 저장
          </button>
          <button className="btn-social-save naver">
            <span className="social-icon naver-icon">N</span>
            네이버로 내 정보 저장
          </button>
          <button className="btn-social-save google">
            <span className="social-icon google-icon">G</span>
            구글로 내 정보 저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
