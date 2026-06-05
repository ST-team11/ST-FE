import resultTypes from '../data/resultTypes';

function getScore(val, map) {
  return map[val] !== undefined ? map[val] : 50;
}

export function calculateResult(answers) {
  const a = answers;

  // Electricity: AC usage (Q5), standby power (Q9), lights off (Q10)
  const acMap = { 0: 90, 1: 65, 2: 40, 3: 15 };
  const unplugMap = { 0: 95, 1: 70, 2: 40, 3: 15 };
  const lightMap = { 0: 95, 1: 70, 2: 40, 3: 15 };
  const electricityScore = Math.round(
    (getScore(a[5], acMap) + getScore(a[9], unplugMap) + getScore(a[10], lightMap)) / 3
  );

  // Water: shower duration (Q7), laundry frequency (Q8)
  const showerMap = { 0: 95, 1: 70, 2: 40, 3: 15 };
  const laundryMap = { 0: 90, 1: 65, 2: 35, 3: 15 };
  const waterScore = Math.round(
    (getScore(a[7], showerMap) + getScore(a[8], laundryMap)) / 2
  );

  // Gas: heating/cooling temp (Q6)
  const tempMap = { 0: 95, 1: 70, 2: 40, 3: 15 };
  const gasScore = getScore(a[6], tempMap);

  // Consciousness: bill checking (Q11), saving practices (Q14)
  const billMap = { 0: 90, 1: 60, 2: 30, 3: 10 };
  const billScore = getScore(a[11], billMap);
  const practicesCount = Array.isArray(a[14]) ? a[14].length : 0;
  const practicesScore = Math.min(100, practicesCount * 12.5);
  const consciousnessScore = Math.round((billScore + practicesScore) / 2);

  const totalScore = Math.round(
    (electricityScore + waterScore + gasScore + consciousnessScore) / 4
  );

  let typeIndex;
  if (totalScore >= 85) typeIndex = 0;
  else if (totalScore >= 75) typeIndex = 1;
  else if (totalScore >= 65) typeIndex = 2;
  else if (totalScore >= 55) typeIndex = 3;
  else if (totalScore >= 45) typeIndex = 4;
  else if (totalScore >= 35) typeIndex = 5;
  else if (totalScore >= 25) typeIndex = 6;
  else typeIndex = 7;

  return {
    type: resultTypes[typeIndex],
    scores: {
      electricity: electricityScore,
      water: waterScore,
      gas: gasScore,
      consciousness: consciousnessScore,
    },
  };
}
