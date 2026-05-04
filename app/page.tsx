'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

// 문항 데이터
const questions = {
  step1: {
    title: '📍 [1단계] 초기 문항 (난이도: 중)',
    text: 'Q1. 기존 선형 검사(고전검사이론 기반)와 비교할 때, 컴퓨터화 적응 검사(CAT)의 가장 핵심적인 특징으로 알맞은 것은?',
    options:[
      '① 모든 피험자에게 사전에 조립된 동일한 문항 세트를 제공하여 공정성을 극대화한다.',
      '② 피험자의 연속적인 응답 패턴을 실시간으로 분석하여, 후속 문항의 난이도를 동적으로 조절한다.',
      '③ 한 번 제출한 답안은 절대 수정할 수 없도록 통제하여 시험의 타당도를 높인다.',
      '④ 총괄평가(Summative Assessment)의 기능을 강화하여 서열화에 최적화되어 있다.',
    ],
    answer: 1, // 배열 인덱스 (실제 2번)
  },
  step2A: {
    title: '📈 [2단계-A] 심화 문항 (난이도: 상)',
    text: 'Q2-A. 차세대 CAT 시스템에서는 단기 탐욕 알고리즘(Greedy Algorithm)의 한계(문항 노출 편중 등)를 극복하기 위해 새로운 기술을 도입했습니다. 다량의 모의고사 시뮬레이션을 통해 장기적인 관점에서 문항 풀의 활용도를 극대화하는 정책(Policy)을 인공지능이 스스로 학습하게 하는 이 알고리즘의 명칭은 무엇입니까?',
    options:[
      '① 마르코프 연쇄 몬테카를로(MCMC)',
      '② 단계적 적응형 검사(MST)',
      '③ 이중 심층 Q-러닝(Double Deep Q-learning)',
      '④ 인지진단모형(CDM)',
    ],
    answer: 2, // 3번
  },
  step2B: {
    title: '📉 [2단계-B] 기초 문항 (난이도: 하)',
    text: 'Q2-B. 보고서에 따르면, 기존의 고전검사이론(CTT) 환경에서는 피험자의 능력이 출제된 문항의 평균적인 난이도에 따라 심하게 변동되는 심각한 오류가 발생합니다. 이러한 현상을 무엇이라고 부릅니까?',
    options:[
      '① 집단 종속성 (Sample Dependency)',
      '② 환각 현상 (Hallucination)',
      '③ 블랙박스 현상 (Blackbox)',
      '④ 자동화의 역설 (Paradox of Automation)',
    ],
    answer: 0, // 1번
  },
  step3: {
    최상: 'Q3-최상. 대규모 언어 모델(LLM)을 활용한 자동 문항 생성(AIG)은 생산성이 높지만 \'환각 현상\'과 \'편향성\'의 위험이 있습니다. 보고서에서는 이를 회피하고 시험의 신뢰성을 담보하기 위해 개발 단계부터 어떤 프레임워크를 의무적으로 채택해야 한다고 주장했습니까? (주관식)',
    중상: 'Q3-중상. 순수 CAT의 심리적 불안감을 줄이기 위해 널리 도입되고 있는 형태입니다. 문항 단위가 아닌 \'모듈(Module)\'이나 \'테스트릿\' 단위로 적응하며, 모듈 내에서는 자유롭게 문항을 건너뛰거나 답안을 수정할 수 있는 검사 방식은 무엇입니까? (주관식, 약어 가능)',
    중하: 'Q3-중하. 2025년부터 대한민국 공교육 현장(초3~4, 중1 등 수학, 영어, 정보 교과 우선)에 전면 도입되어, 내부적으로 CAT 및 AI 튜터링 기술을 활용해 맞춤형 교육을 제공하는 시스템의 명칭은 무엇입니까? (주관식, 약어 가능)',
    최하: 'Q3-최하. CAT가 작동하기 위한 척추 역할을 하는 핵심 수학적 기초 이론입니다. 피험자가 특정 문항의 정답을 맞힐 확률을 \'피험자의 잠재적 능력\'과 \'문항의 특성(난이도, 변별도, 추측도)\' 간의 함수로 모델링하는 이 이론은 무엇입니까? (주관식, 약어 가능)',
  },
};

export default function CATApp() {
  const [step, setStep] = useState(0); // 0: 시작, 1: 1단계, 2: 2단계, 3: 3단계, 4: 결과
  const [studentName, setStudentName] = useState('');
  const[q1Ans, setQ1Ans] = useState<number | null>(null);
  const [q2Type, setQ2Type] = useState<'A' | 'B' | null>(null);
  const [q2Ans, setQ2Ans] = useState<number | null>(null);
  const [q3Type, setQ3Type] = useState<'최상' | '중상' | '중하' | '최하' | null>(null);
  const [q3Ans, setQ3Ans] = useState('');
  const[isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep1 = () => {
    if (q1Ans === null) return alert('정답을 선택해주세요.');
    // 1번 문제 정답 확인 (index 1이 2번 보기)
    if (q1Ans === questions.step1.answer) {
      setQ2Type('A');
    } else {
      setQ2Type('B');
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (q2Ans === null) return alert('정답을 선택해주세요.');
    if (q2Type === 'A') {
      if (q2Ans === questions.step2A.answer) setQ3Type('최상');
      else setQ3Type('중상');
    } else {
      if (q2Ans === questions.step2B.answer) setQ3Type('중하');
      else setQ3Type('최하');
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!q3Ans.trim()) return alert('답을 입력해주세요.');
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('cat_results').insert([
        {
          student_name: studentName,
          q1_answer: (q1Ans! + 1).toString(), // 보기 번호로 저장
          q2_type: q2Type,
          q2_answer: (q2Ans! + 1).toString(),
          q3_type: q3Type,
          q3_answer: q3Ans,
        },
      ]);

      if (error) throw error;
      setStep(4);
    } catch (error) {
      console.error(error);
      alert('결과 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        {step === 0 && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">CAT 기반 맞춤형 이해도 평가</h1>
            <p className="text-gray-600">이름을 입력하고 평가를 시작하세요.</p>
            <input
              type="text"
              placeholder="이름 입력"
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <button
              onClick={() => {
                if (!studentName.trim()) alert('이름을 입력해주세요.');
                else setStep(1);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              평가 시작
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-600">{questions.step1.title}</h2>
            <p className="font-medium text-gray-800 leading-relaxed">{questions.step1.text}</p>
            <div className="space-y-3">
              {questions.step1.options.map((opt, idx) => (
                <label key={idx} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    name="q1"
                    className="mt-1"
                    checked={q1Ans === idx}
                    onChange={() => setQ1Ans(idx)}
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleNextStep1}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              다음 단계로
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-600">
              {q2Type === 'A' ? questions.step2A.title : questions.step2B.title}
            </h2>
            <p className="font-medium text-gray-800 leading-relaxed">
              {q2Type === 'A' ? questions.step2A.text : questions.step2B.text}
            </p>
            <div className="space-y-3">
              {(q2Type === 'A' ? questions.step2A.options : questions.step2B.options).map((opt, idx) => (
                <label key={idx} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    name="q2"
                    className="mt-1"
                    checked={q2Ans === idx}
                    onChange={() => setQ2Ans(idx)}
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleNextStep2}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              다음 단계로
            </button>
          </div>
        )}

        {step === 3 && q3Type && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-600">🏆 [3단계] 최종 진단 문항 ({q3Type} 난이도)</h2>
            <p className="font-medium text-gray-800 leading-relaxed">{questions.step3[q3Type]}</p>
            <input
              type="text"
              placeholder="정답을 입력하세요"
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={q3Ans}
              onChange={(e) => setQ3Ans(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {isSubmitting ? '제출 중...' : '최종 제출'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800">평가가 완료되었습니다!</h2>
            <p className="text-gray-600">
              {studentName} 학생의 최종 도달 레벨은 <span className="font-bold text-blue-600">[{q3Type}]</span> 입니다.
            </p>
            <p className="text-sm text-gray-500">결과가 성공적으로 저장되었습니다.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              처음으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
