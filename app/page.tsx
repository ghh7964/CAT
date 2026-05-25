'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { verifyAnswer } from './actions';

// 📚 문항 데이터 (원본 텍스트 그대로 반영, 정답은 백엔드에 있음)
const questions = {
  1: {
    2: {
      title: '1. 기존 문제 한계',
      text: '현행 CBT(컴퓨터 기반 평가)가 가진 고정형 문항 제시 방식의 한계점으로 보기 어려운 것은? [2점]',
      options: [
        '① 모든 학생에게 동일한 문항 세트를 제공하므로 측정의 비효율성이 발생한다.',
        '② 학생의 수준을 고려하지 못한 문항은 학습자에게 좌절감을 줄 수 있다.',
        '③ 학습자가 각 문항을 해결하는 데 소요된 시간 등 응시 과정의 로그 데이터를 수집·분석할 수 없다.',
        '④ 여러 학급이 시차를 두고 응시할 경우 문항 유출 등 보안 유지에 취약하다.'
      ],
    }
  },
  2: {
    3: {
      title: '2. CAT 원리',
      text: 'CAT의 기본 진행 과정으로 시작 문항 제시 다음 가장 적절한 것은? [3점]',
      options: [
        '① 응답 → 최적 문항 선택 및 제시 → 능력모수 추정 → 종료 규칙 확인',
        '② 응답 → 능력모수 추정 → 종료 규칙 확인 → 최적 문항 선택 및 제시',
        '③ 종료 규칙 확인 → 응답 → 능력모수 추정 → 최적 문항 선택 및 제시',
        '④ 최적 문항 선택 및 제시 → 응답 → 종료 규칙 확인 → 능력모수 추정'
      ],
    },
    1: {
      title: '2. CAT 원리',
      text: 'CAT 시스템을 구동하기 위한 5가지 필수 구성요소에 해당하지 않는 것은? [1점]',
      options: [
        '① 어떤 기준으로 검사를 마칠지 결정하는 종료 규칙',
        '② 응답 결과에 따라 문항을 선택하는 문항 선정 방법',
        '③ 모든 응시자가 공통으로 풀어야 하는 기준 문항 세트',
        '④ 피검자의 수준을 체계적으로 수치화하는 능력모수 추정 방법'
      ],
    }
  },
  3: {
    3: {
      title: '3. 적용 가능성 및 방안',
      text: '박현 외(2026)의 \'교양 영어 CAT 진단 시스템\' 연구에 대한 설명 및 결과로 옳은 것은? [3점]',
      options: [
        '① 대학생의 영어 기초학력을 진단하기 위해 연구진이 자체적으로 신규 개발한 100개의 문항을 활용하여 문항은행을 구축하였다.',
        '② 듣기 영역에서는 CAT 실시 집단이 비실시 집단보다 더 큰 향상을 보였으며, 읽기 영역에서는 CAT 실시 집단에서만 유의미한 향상이 나타났다.',
        '③ 읽기 영역에서는 CAT 실시 집단과 비실시 집단 모두 유의미한 점수 향상을 보였으나, 듣기 영역에서는 집단 간 유의미한 차이가 발견되지 않았다.',
        '④ 이 연구는 CAT 시스템이 학생들의 기초학력을 정확히 진단하는 데는 유용하지만, 반복적인 학습 보조 도구로 활용하기에는 한계가 있음을 시사한다.'
      ],
    },
    2: {
      title: '3. 적용 가능성 및 방안',
      text: '기초학력진단평가에서 CAT(컴퓨터 적응형 평가)가 제공하는 \'진단적 유용성\'을 가장 잘 설명한 사례는? [2점]',
      options: [
        '① 학생이 특정 문항에서 오답을 낼 경우, 정답을 맞힐 때까지 동일한 난이도의 유사 문항을 반복 제시하여 해당 개념을 암기하도록 유도했다.',
        '② 학생이 분수 연산 문항을 틀리자, 하위 개념인 통분이나 약분 문항을 이어서 제시하여 학습 결손이 발생한 정확한 위치를 파악했다.',
        '③ 컴퓨터 환경의 장점을 살려, 학생의 응답 여부와 상관없이 사전에 구축된 문항은행에서 다양한 난이도의 문항 30개를 무작위로 추출하여 제공했다.',
        '④ 평가의 신뢰도를 높이기 위해 모든 학생에게 최하 난이도의 문항부터 시작하여 점진적으로 난이도를 높여가는 방식을 일괄 적용했다.'
      ],
    },
    1: {
      title: '3. 적용 가능성 및 방안',
      text: '다음 중 한국 교육 환경에서 CAT(컴퓨터 적응형 평가)를 도입할 때 가장 적절한 활용 분야는? [1점]',
      options: [
        '① 학생들의 서열을 엄격하게 나누는 내신 지필 평가',
        '② 학생의 현재 수준을 진단하고 보충 학습으로 연결하는 맞춤형 진단 평가',
        '③ 모든 학생에게 동일한 문항을 배부하여 형평성을 강조하는 총괄 평가',
        '④ 개별 학습자의 수준과 상관없이 문항 노출을 극대화하는 정기 고사'
      ],
    }
  },
  4: {
    3: {
      title: '4. 한계 및 해결방안',
      text: '베이즈 정리 등을 활용한 매우 정교하고 복잡한 다차원 CAT 알고리즘(MCMC 시뮬레이션 등)은 그 계산량이 너무 방대하여 실시간 온라인 평가 도중 응답 지연을 일으키는 한계가 있었다. 이 연산 속도 한계의 해결 방안은 무엇인가? [3점]',
      options: [
        '① MCMC 연산의 수렴성 판단 기준을 대폭 완화하여, 최소한의 반복 계산만 수행한 후 조기에 연산을 종료시킨다.',
        '② MCMC의 반복적인 시뮬레이션 과정을 거치지 않고, 사후 분포의 수학적 특성을 활용해 표본을 즉각 추출하는 직접 샘플링 알고리즘을 도입한다.',
        '③ 복잡한 통계적 수치 연산 과정을 생략하기 위해, 사전 학습된 대규모 언어 모델(LLM)에 학습자의 정오답 패턴을 입력하여 다음 적정 문항과 능력치를 실시간으로 추론하게 한다.',
        '④ 다차원 잠재 특성 간의 상관관계를 무시하고 각 차원을 독립적인 단일 차원으로 간주하여, 개별 차원별로 독립된 단일차원 CAT 알고리즘을 병렬 구동한다.'
      ],
    },
    2: {
      title: '4. 한계 및 해결방안',
      text: '순수 CAT 방식에서 응시자가 느끼는 이전 문항으로 돌아갈 수 없는 불안감을 해결하기 위해 도입할 수 있는 시스템 구조는? [2점]',
      options: [
        '① 최대우도추정법(MLE) 기반 정밀 산출 시스템',
        '② 실시간 중요도 샘플링(Importance Sampling) 프레임워크',
        '③ 단계적 적응형 검사(Multistage Testing, MST)',
        '④ 가변 길이 종료 규칙(Variable-length Termination)'
      ],
    },
    1: {
      title: '4. 한계 및 해결방안',
      text: 'CAT에서 특정 문항이 너무 자주 출제되어 보안 문제가 생길 수 있는 한계를 줄이기 위한 방안으로 가장 적절한 것은? [1점]',
      options: [
        '① 문항 선택 과정에서 문항 노출을 제어한다',
        '② 문항은행의 규모를 줄인다',
        '③ 이전 문항 수정 기능을 없앤다',
        '④결과표 제공 속도를 높인다'
      ],
    }
  }
};

export default function CATApp() {
  const [step, setStep] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [entryCodeInput, setEntryCodeInput] = useState('');
  
  const [currentLevel, setCurrentLevel] = useState(2);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  
  const [settings, setSettings] = useState<{ is_open: boolean } | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('admin_settings').select('is_open').eq('id', 1).single();
      if (data) setSettings(data);
      setIsLoadingSettings(false);
    };
    fetchSettings();
  }, []);

  const handleStart = async () => {
    if (!settings?.is_open) return alert('현재 평가는 마감되었습니다.');
    if (!studentName.trim()) return alert('이름을 입력해주세요.');
    if (!entryCodeInput.trim()) return alert('개별 입장 코드를 입력해주세요.');

    setIsCheckingCode(true);
    try {
      const { data: validCode } = await supabase.from('valid_codes').select('code').eq('code', entryCodeInput).single();
      if (!validCode) {
        alert('존재하지 않거나 잘못된 입장 코드입니다.');
        setIsCheckingCode(false);
        return;
      }
      const { data: isUsed } = await supabase.rpc('check_code_used', { input_code: entryCodeInput });
      if (isUsed) {
        alert('이미 평가 제출이 완료된 코드입니다. (중복 참여 불가)');
        setIsCheckingCode(false);
        return;
      }
      setStep(1);
    } catch (error) {
      console.error(error);
      alert('코드 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleNext = async () => {
    if (selectedAns === null) return alert('정답을 선택해주세요.');

    setIsCheckingAnswer(true);

    try {
      const { isCorrect, earnedScore } = await verifyAnswer(step, currentLevel, selectedAns);

      const newTotalScore = totalScore + earnedScore;
      const newHistory = [...history, { level: currentLevel, isCorrect }];
      
      setTotalScore(newTotalScore);
      setHistory(newHistory);

      if (step === 4) {
        await submitResult(newHistory, newTotalScore);
      } else {
        if (isCorrect) {
          setCurrentLevel(prev => Math.min(3, prev + 1));
        } else {
          setCurrentLevel(prev => Math.max(1, prev - 1));
        }
        setStep(prev => prev + 1);
        setSelectedAns(null);
      }
    } catch (error) {
      console.error("채점 중 오류 발생:", error);
      alert("채점 서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const submitResult = async (finalHistory: any[], finalScore: number) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('cat_results_v2').insert([
        {
          student_name: studentName,
          access_code: entryCodeInput,
          q1_level: finalHistory[0].level, q1_correct: finalHistory[0].isCorrect,
          q2_level: finalHistory[1].level, q2_correct: finalHistory[1].isCorrect,
          q3_level: finalHistory[2].level, q3_correct: finalHistory[2].isCorrect,
          q4_level: finalHistory[3].level, q4_correct: finalHistory[3].isCorrect,
          total_score: finalScore,
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          alert('이미 제출이 완료된 코드입니다.');
          window.location.reload();
          return;
        }
        throw error;
      }
      setStep(5);
    } catch (error) {
      console.error(error);
      alert('결과 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // @ts-ignore
  const currentQuestion = step > 0 && step < 5 ? questions[step][currentLevel] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        
        {isLoadingSettings && step === 0 && (
          <div className="text-center py-10 text-gray-500">시스템 설정을 불러오는 중입니다...</div>
        )}

        {/* 시작 화면 */}
        {!isLoadingSettings && step === 0 && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">CAT 기반 맞춤형 이해도 평가</h1>
            {settings?.is_open ? (
              <>
                <p className="text-gray-600">이름과 부여받은 <span className="font-bold text-blue-600">개별 입장 코드</span>를 입력하세요.</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="이름 입력 (예: 홍길동)"
                    className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="입장 코드 입력 (예: CODE-001)"
                    className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    value={entryCodeInput}
                    onChange={(e) => setEntryCodeInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  />
                </div>
                <button
                  onClick={handleStart}
                  disabled={isCheckingCode}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {isCheckingCode ? '코드 확인 중...' : '평가 시작'}
                </button>
              </>
            ) : (
              <div className="py-8 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 font-bold text-lg">🚫 현재 평가가 마감되었습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* 문제 풀이 화면 */}
        {step >= 1 && step <= 4 && currentQuestion && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-bold text-gray-500">진행도: {step} / 4</span>
              <span className="text-sm font-bold text-blue-500">현재 획득 점수: {totalScore}점</span>
            </div>
            
            <h2 className="text-xl font-bold text-blue-600">{currentQuestion.title}</h2>
            <p className="font-medium text-gray-800 leading-relaxed">{currentQuestion.text}</p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((opt: string, idx: number) => (
                <label key={idx} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input 
                    type="radio" 
                    name={`q${step}`} 
                    className="mt-1" 
                    checked={selectedAns === idx} 
                    onChange={() => setSelectedAns(idx)} 
                    disabled={isCheckingAnswer || isSubmitting}
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
            
            <button 
              onClick={handleNext} 
              disabled={isCheckingAnswer || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isCheckingAnswer ? '채점 중...' : isSubmitting ? '제출 중...' : (step === 4 ? '최종 제출' : '다음 문항')}
            </button>
          </div>
        )}

        {/* 완료 화면 */}
        {step === 5 && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800">평가가 완료되었습니다!</h2>
            <p className="text-gray-600">
              {studentName} 학생의 최종 획득 점수는 <span className="font-bold text-blue-600 text-xl">{totalScore}점</span> 입니다.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg inline-block mt-4">
              <p className="text-sm text-gray-500">사용된 입장 코드</p>
              <p className="font-mono font-bold text-gray-700 tracking-wider">{entryCodeInput}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">결과가 성공적으로 저장되었습니다. 창을 닫으셔도 됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}