import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./LoginStatusButton.css";

// 임시 확인용 버튼 (디자인 확정 전까지). 클릭 시 현재 로그인 상태 표시
function LoginStatusButton() {
  const [status, setStatus] = useState("");

  const check = async () => {
    const { data } = await supabase.auth.getUser();
    setStatus(data.user ? `로그인됨 ${data.user.email}` : "로그아웃 상태");
  };

  return (
    <div className="login-status-check">
      <button className="login-status-check-btn" onClick={check}>
        로그인 상태 확인
      </button>
      {status && <p className="login-status-check-text">{status}</p>}
    </div>
  );
}

export default LoginStatusButton;
