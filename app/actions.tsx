// app/actions.ts
'use server';

// 🔒 정답 데이터 (클라이언트에 노출되지 않음)
// 구조: { 단원: { 난이도: 정답인덱스 } }
const answerKey = {
  1: { 2: 2 }, // 1단원 중 -> 정답 ③ (인덱스 2)
  2: { 3: 1, 1: 2 }, // 2단원 상 -> 정답 ② (인덱스 1), 하 -> 정답 ③ (인덱스 2)
  3: { 3: 1, 2: 1, 1: 1 }, // 3단원 상 -> 정답 ② (인덱스 1), 중 -> 정답 ② (인덱스 1), 하 -> 정답 ② (인덱스 1)
  4: { 3: 1, 2: 2, 1: 0 }  // 4단원 상 -> 정답 ② (인덱스 1), 중 -> 정답 ③ (인덱스 2), 하 -> 정답 ① (인덱스 0)
};

export async function verifyAnswer(step: number, level: number, selectedAns: number) {
  // @ts-ignore
  const correctAns = answerKey[step][level];
  const isCorrect = selectedAns === correctAns;
  
  // 가중치 점수 계산 (맞히면 해당 레벨 점수, 틀리면 0점)
  const earnedScore = isCorrect ? level : 0;

  return { isCorrect, earnedScore };
}