import React, { useState } from 'react';
import IntroPage from './pages/IntroPage';
import QuizPage from './pages/QuizPage';
import LoadingPage from './pages/LoadingPage';
import ResultPage from './pages/ResultPage';
import './App.css';

function App() {
  const [screen, setScreen] = useState('intro');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleStart = () => setScreen('quiz');

  const handleQuizComplete = (finalAnswers) => {
    setAnswers(finalAnswers);
    setScreen('loading');
  };

  const handleLoadingComplete = (resultData) => {
    setResult(resultData);
    setScreen('result');
  };

  const handleRestart = () => {
    setAnswers({});
    setResult(null);
    setScreen('intro');
  };

  return (
    <div className="app-shell">
      {screen === 'intro' && (
        <IntroPage onStart={handleStart} />
      )}
      {screen === 'quiz' && (
        <QuizPage onComplete={handleQuizComplete} onBack={handleRestart} />
      )}
      {screen === 'loading' && (
        <LoadingPage answers={answers} onComplete={handleLoadingComplete} />
      )}
      {screen === 'result' && (
        <ResultPage result={result} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
