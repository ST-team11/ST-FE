import React, { useEffect, useState } from 'react';
import IntroPage from './pages/IntroPage';
import QuizPage from './pages/QuizPage';
import LoadingPage from './pages/LoadingPage';
import ResultPage from './pages/ResultPage';
import { supabase } from './lib/supabaseClient';
import { loadPendingResult, clearPendingResult } from './lib/pendingResult';
import './App.css';

function App() {
  const [screen, setScreen] = useState('intro');
  const [quizData, setQuizData] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [payload, setPayload] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // OAuth 리디렉션 복귀 시 직전 결과를 복원해 결과 화면 유지
    const pending = loadPendingResult();
    if (pending) {
      setEvaluation(pending.evaluation);
      setPayload(pending.payload);
      setScreen('result');
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleStart = () => setScreen('quiz');

  const handleQuizComplete = (data) => {
    setQuizData(data);
    setScreen('loading');
  };

  const handleLoadingComplete = (result, builtPayload) => {
    setEvaluation(result);
    setPayload(builtPayload);
    setScreen('result');
  };

  const handleLoadingError = (message) => {
    window.alert(message ?? '결과를 불러오지 못했어요. 다시 시도해 주세요.');
    setScreen('quiz');
  };

  const handleRestart = () => {
    clearPendingResult();
    setQuizData(null);
    setEvaluation(null);
    setPayload(null);
    setScreen('intro');
  };

  return (
    <div className="app-shell">
      {screen === 'intro' && (
        <IntroPage onStart={handleStart} session={session} />
      )}
      {screen === 'quiz' && (
        <QuizPage onComplete={handleQuizComplete} onBack={handleRestart} />
      )}
      {screen === 'loading' && (
        <LoadingPage
          quizData={quizData}
          onComplete={handleLoadingComplete}
          onError={handleLoadingError}
        />
      )}
      {screen === 'result' && (
        <ResultPage
          evaluation={evaluation}
          payload={payload}
          session={session}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
