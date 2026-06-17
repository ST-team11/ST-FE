// FE 설문 답변(인덱스)을 백엔드 평가 페이로드로 변환
// 매핑 근거 ST-BE/offlog/supabase/functions/_shared/assessment.ts 답변 키 값

const HOUSEHOLD_SIZE = ['1', '2', '3-4', '5+']; // Q2 거주 인원
const AREA = ['under10', '10-20', '20-30', 'over30']; // Q3 면적
const AC_HOURS = ['none', '1-2', '3-5', '6+']; // Q5 에어컨 사용 빈도
const AC_TEMP = ['over26', '24-26', 'under23', 'under23']; // Q6 냉난방 설정 온도
const HEATING_PATTERN = ['rarely', 'off_when_out', 'mostly_on', 'mostly_on']; // Q6 기준 난방 강도 추정
const STANDBY_POWER = ['unplug', 'unplug', 'unknown', 'plugged']; // Q9 플러그 분리 습관
const LIGHTING = ['necessary', 'necessary', 'most', 'allday']; // Q10 외출 시 조명
const HOME_TIME = ['rarely', '3-6', 'mostly', 'mostly']; // Q13 하루 재택 시간

// Q4(보유 가전) 옵션 인덱스를 백엔드 가전 id로 매핑 (해당 없으면 무시)
const APPLIANCE_BY_INDEX = { 3: 'dryer', 10: 'air_purifier', 11: 'dishwasher' };

// 현재 월로 계절 구분 (assessment.ts resolveSeason과 동일 규칙)
export function resolveSeason(month) {
  if (month === 7 || month === 8) return 'summer';
  if (month === 12 || month <= 3) return 'winter';
  return 'other';
}

const pick = (map, index) => (index !== undefined ? map[index] : undefined);

function buildAnswerSnapshot(answers) {
  const snapshot = {
    household_size: pick(HOUSEHOLD_SIZE, answers[2]),
    area: pick(AREA, answers[3]),
    ac_hours: pick(AC_HOURS, answers[5]),
    ac_temp: pick(AC_TEMP, answers[6]),
    heating_pattern: pick(HEATING_PATTERN, answers[6]),
    standby_power: pick(STANDBY_POWER, answers[9]),
    lighting: pick(LIGHTING, answers[10]),
    home_time: pick(HOME_TIME, answers[13]),
  };

  // 백엔드 validation은 문자열 값만 허용, 미응답 키는 제거
  return Object.fromEntries(
    Object.entries(snapshot).filter(([, value]) => typeof value === 'string'),
  );
}

function buildAppliances(answers) {
  const selected = Array.isArray(answers[4]) ? answers[4] : [];
  return selected.map((index) => APPLIANCE_BY_INDEX[index]).filter(Boolean);
}

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

export function buildAssessmentPayload({ answers, billData }) {
  const month = new Date().getMonth() + 1;

  return {
    inputSnapshot: {
      electricityBill: toAmount(billData?.electricity?.fee),
      gasBill: toAmount(billData?.gas?.fee),
      waterBill: toAmount(billData?.water?.fee),
      waterBillingMonths: 1,
      season: resolveSeason(month),
      appliances: buildAppliances(answers),
    },
    answerSnapshot: buildAnswerSnapshot(answers),
  };
}
