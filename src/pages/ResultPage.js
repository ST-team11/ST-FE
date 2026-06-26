import React, { useState, useRef } from "react";
import { toBlob } from "html-to-image";
import { supabase } from "../lib/supabaseClient";
import { saveAssessmentResult } from "../lib/api";
import { loginWithProvider } from "../lib/auth";
import { savePendingResult } from "../lib/pendingResult";
import "./ResultPage.css";

const SCORE_BARS = [
  { key: "electricity", label: "전기 절약", color: "#F5A623" },
  { key: "water", label: "수도 절약", color: "#4A90D9" },
  { key: "gas", label: "가스 절약", color: "#E74C3C" },
  { key: "consciousness", label: "절약 의식", color: "#00995E" },
];

function ShareModal({ url, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("링크 복사에 실패했어요.");
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <p className="share-modal-title">결과 공유하기</p>
        <div className="share-url-box">
          <span className="share-url">{url}</span>
          <button className="share-copy-btn" onClick={handleCopy}>
            {copied ? "복사됨 ✓" : "복사"}
          </button>
        </div>
        <button className="share-modal-close" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

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

function ResultPage({ evaluation, payload, session, onRestart }) {
  const [saveState, setSaveState] = useState("idle"); // idle, saving, saved
  const [showShareModal, setShowShareModal] = useState(false);
  const [saveImageState, setSaveImageState] = useState("idle"); // idle, saving, saved
  const cardRef = useRef(null);

  const { type, scores } = evaluation;

  const handleLogin = async (provider) => {
    if (provider === "google") savePendingResult(evaluation, payload);
    await loginWithProvider(provider);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSaveState("idle");
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaveImageState("saving");
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `에너지절약테스트_${type.title}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setSaveImageState("saved");
      setTimeout(() => setSaveImageState("idle"), 2000);
    } catch {
      window.alert("이미지 저장에 실패했어요.");
      setSaveImageState("idle");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `나는 ${type.title}!`;
    const shareText = `${type.tagline}\n에너지 절약 테스트를 직접 해보세요!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (error) {
        if (error.name !== "AbortError") setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleSave = async () => {
    if (!session) return;
    setSaveState("saving");
    try {
      await saveAssessmentResult(payload, session.access_token);
      setSaveState("saved");
    } catch (error) {
      setSaveState("idle");
      window.alert(`저장에 실패했어요: ${error.message}`);
    }
  };

  const saveLabel = {
    idle: "내 결과 저장하기",
    saving: "저장 중...",
    saved: "저장 완료 ✓",
  }[saveState];

  return (
    <div className="result-page">
      {showShareModal && (
        <ShareModal
          url={window.location.href}
          onClose={() => setShowShareModal(false)}
        />
      )}
      <div className="result-body">
        <div ref={cardRef} className="result-card">
          <p className="result-tagline">{type.tagline}</p>
          <h1 className="result-type-name">{type.title}</h1>

          <div className="result-character">
            {type.image && <img src={type.image} alt={type.name} />}
          </div>
          <p className="result-summary">{type.summary}</p>

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
          <p className="score-caption">
            막대가 길수록 에너지를 절약하고 있다는 뜻이에요.
          </p>

          <hr className="divider" />

          <div className="tips-section">
            <h3 className="tips-title">이렇게 해보세요!</h3>
            <p className="tips-direction">{type.tipDirection}</p>
            <ul className="tips-list">
              {type.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="divider" />

        <div className="action-buttons">
          <button className="btn-action share" onClick={handleShare}>
            🧑‍💻 결과 공유하기
          </button>
          <button
            className="btn-action save-img"
            onClick={handleSaveImage}
            disabled={saveImageState !== "idle"}
          >
            {saveImageState === "saving"
              ? "저장 중..."
              : saveImageState === "saved"
              ? "저장 완료 ✓"
              : "🖼️ 결과 이미지 저장하기"}
          </button>
          <button className="btn-action restart" onClick={onRestart}>
            테스트 다시하기
          </button>
        </div>

        <hr className="divider" />

        {session ? (
          <div className="auth-status">
            <p className="social-save-hint">
              {session.user.email}님으로 로그인됨
            </p>
            <button
              className="btn-action"
              onClick={handleSave}
              disabled={saveState !== "idle"}
            >
              {saveLabel}
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <p className="social-save-hint">
              로그인하면 내 정보를 저장하고 불러올 수 있어요!
            </p>

            <div className="social-save-buttons">
              <button
                className="btn-social-save kakao"
                onClick={() => handleLogin("kakao")}
              >
                <span className="social-icon">💬</span>
                카카오로 내 정보 저장
              </button>

              <button
                className="btn-social-save google"
                onClick={() => handleLogin("google")}
              >
                <span className="social-icon google-icon">G &nbsp;&nbsp;</span>
                구글로 내 정보 저장
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ResultPage;
