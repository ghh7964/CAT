// app/actions.ts
'use server';

// 🔒 정답 데이터 (서버에만 존재하므로 학생들은 절대 볼 수 없음)
// 구조: { step: { level: 정답인덱스 } }
const answerKey = {
  1: { 2: 2 }, // 1단원 중(2) -> 정답 ③(2)
  2: { 3: 1, 1: 2 }, // 2단원 상(3)->②(1), 하(1)->③(2)
  3: { 3: 1, 2: 1, 1: 1 }, // 3단원 상(3)->②(1), 중(2)->②(1), 하(1)->②(1)
  4: { 3: 1, 2: 2, 1: 0 }  // 4단원 상(3)->②(1), 중(2)->③(2), 하(1)->①(0)
};

// 클라이언트에서 호출할 채점 함수
export async function verifyAnswer(step: number, level: number, selectedAns: number) {
  // @ts-ignore
  const correctAns = answerKey[step][level];
  const isCorrect = selectedAns === correctAns;
  
  // 가중치 점수 계산 (맞히면 해당 레벨 점수, 틀리면 0점)
  const earnedScore = isCorrect ? level : 0;

  return { isCorrect, earnedScore };
}