import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY 가 .env 에 설정되어야 합니다.',
  );
}

// 로그인 진단: supabase가 URL 해시를 소비하기 전에 복귀 URL 원본 기록
if (typeof window !== "undefined") {
  console.log("[auth:debug] entry href =", window.location.href);
  console.log("[auth:debug] entry origin =", window.location.origin);
  console.log("[auth:debug] entry hash =", window.location.hash || "(none)");
  console.log("[auth:debug] entry search =", window.location.search || "(none)");
}

// 세션은 localStorage에 자동 저장 갱신 (persistSession 기본값)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
