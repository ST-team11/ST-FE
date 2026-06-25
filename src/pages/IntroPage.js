import React from "react";
import { loginWithProvider } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";
import "./IntroPage.css";
import intro_icon from "../image/intro_icon.svg";
import kkt_icon from "../image/kkt_icon.svg";
import google_icon from "../image/google_icon.svg";

function IntroPage({ onStart, session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="intro-page">
      <div className="intro-content">
        <p className="intro-subtitle">우리집 에너지, 얼마나 쓰고 있을까?</p>
        <h1 className="intro-title">
          나의 에너지 소비 유형
          <br />
          알아 보기
        </h1>

        <div className="intro-features">
          <div className="feature-item">
            <div className="feature-icon-wrap">✅</div>
            <span className="feature-text">
              질문은
              <br />단 15개!
            </span>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrap">⏱️</div>
            <span className="feature-text">
              3분만에
              <br />
              간단하게!
            </span>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrap">📊</div>
            <span className="feature-text">
              8가지 유형으로
              <br />
              정확하게!
            </span>
          </div>
        </div>

        <div className="intro-image-wrap">
          <span className="intro-bulb">
            <img src={intro_icon} alt="전구 아이콘" />
          </span>
        </div>

        <button className="btn-start" onClick={onStart}>
          테스트 시작하기
        </button>

        {session ? (
          <div className="intro-logged-in">
            <p className="intro-logged-in-email">
              <span className="intro-logged-in-dot" />
              <span className="email-text">{session.user.email}</span>
            </p>
            <p className="intro-logged-in-hint">로그인 상태에서 테스트하면 결과가 자동으로 저장돼요</p>
            <button className="btn-logout-intro" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <div className="intro-login-section">
            <p className="intro-login-hint">로그인하면 내 결과를 저장하고 불러올 수 있어요</p>
            <div className="social-login-row">
              <button
                className="social-btn kakao"
                onClick={() => loginWithProvider("kakao")}
              >
                <img src={kkt_icon} alt="카카오톡 소셜" />
              </button>
              <button
                className="social-btn google"
                onClick={() => loginWithProvider("google")}
              >
                <img src={google_icon} alt="구글 소셜" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntroPage;
