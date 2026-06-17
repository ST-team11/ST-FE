// 백엔드 Edge Function 호출 (ST-BE/offlog/supabase/functions)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const functionUrl = (name) => `${SUPABASE_URL}/functions/v1/${name}`;

async function callFunction(name, payload, accessToken) {
  const response = await fetch(functionUrl(name), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      // 인증이 필요한 함수는 로그인 세션의 access_token, 그 외엔 anon 키
      Authorization: `Bearer ${accessToken ?? SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? `요청에 실패했어요 (${response.status})`);
  }

  return data;
}

// 인증 없이 답변 평가 후 결과만 반환
export async function submitAssessment(payload) {
  const data = await callFunction('submit-assessment', payload);
  return data.result;
}

// 로그인 사용자의 결과 평가 후 DB 저장
export async function saveAssessmentResult(payload, accessToken) {
  return callFunction('save-assessment-result', payload, accessToken);
}
