// OAuth 리디렉션 동안 평가 결과를 sessionStorage에 보관 후 복귀 시 복원
const KEY = 'offlog:pending-result';

export function savePendingResult(evaluation, payload) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ evaluation, payload }));
  } catch {
    // 저장 실패는 무시 (결과만 못 살림)
  }
}

export function loadPendingResult() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.evaluation && parsed.payload ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPendingResult() {
  sessionStorage.removeItem(KEY);
}
