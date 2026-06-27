import React, { useEffect, useState } from "react";
import { getAssessmentHistory } from "../lib/api";
import resultTypes from "../data/resultTypes";
import "./HistoryPage.css";

const codeToType = Object.fromEntries(resultTypes.map((t) => [t.code, t]));

function formatDate(isoString) {
  const d = new Date(isoString);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function MiniScoreBar({ score, color }) {
  return (
    <div className="history-score-track">
      <div className="history-score-fill" style={{ width: `${score}%`, backgroundColor: color }} />
    </div>
  );
}

function HistoryCard({ item }) {
  const type = codeToType[item.result_type];
  const typeName = type ? type.title : item.result_type;

  return (
    <div className="history-card">
      <div className="history-card-header">
        <span className="history-card-date">{formatDate(item.created_at)}</span>
        <span className="history-card-type">{typeName}</span>
      </div>
      <div className="history-card-score-row">
        <span className="history-card-score-label">종합 점수</span>
        <MiniScoreBar score={item.comparison_score} color="#00995e" />
        <span className="history-card-score-value">{item.comparison_score}점</span>
      </div>
    </div>
  );
}

function HistoryPage({ session, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) return;
    getAssessmentHistory(session.access_token)
      .then(setHistory)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div className="history-page">
      <div className="history-body">
        <div className="history-top">
          <button className="history-back-btn" onClick={onBack}>←</button>
          <h2 className="history-title">내 이전 결과</h2>
        </div>

        {loading && <p className="history-status">불러오는 중...</p>}
        {error && <p className="history-status history-error">오류가 발생했어요: {error}</p>}

        {!loading && !error && history.length === 0 && (
          <p className="history-status">아직 저장된 결과가 없어요.</p>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="history-list">
            {history.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
