'use client';
// Force cache refresh - timestamp: 2025-07-24-15:30:00

import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizResults } from '../types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trophy, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { getVideoMetadata } from '../lib/videoData';

const QuizPageOriginal: React.FC = () => {
  const [title] = useState("Quiz with AI");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [finalAiScore, setFinalAiScore] = useState(0); // Captured AI score when quiz ends
  const [pendingAiPredictions, setPendingAiPredictions] = useState(0); // Track pending AI predictions
  const [started, setStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<any[]>([]);
  const [previousResults, setPreviousResults] = useState<any[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('0:00');
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Change video playback speed
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Effect to set playback speed when video loads
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [currentIndex, playbackSpeed]);

  // Calculate elapsed time
  const calculateElapsedTime = () => {
    if (!startTime) return '0:00';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Real-time timer update during quiz
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started && !quizEnded && startTime) {
      interval = setInterval(() => {
        setCurrentTime(calculateElapsedTime());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [started, quizEnded, startTime]);

  // Update elapsed time when quiz ends
  useEffect(() => {
    if (quizEnded && startTime) {
      setElapsedTime(calculateElapsedTime());
    }
  }, [quizEnded, startTime]);

  // Get or create user ID (similar to original)
  const getUserID = () => {
    if (typeof document === 'undefined') return 'user_default';
    const cookieName = "userID";
    const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    if (match) return match[2];
    const newID = 'user_' + Math.random().toString(36).substring(2, 12);
    document.cookie = `${cookieName}=${newID}; max-age=31536000; path=/`;
    return newID;
  };

  // Start quiz function
  const startQuiz = async () => {
    setStarted(true);
    setLoading(true);
    setStartTime(Date.now());
    
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Could not fetch questions:', error);
      // You could set some default questions here if needed
    } finally {
      setLoading(false);
    }
  };

  // Get AI answer
  const getAIAnswer = async (questionObj: QuizQuestion): Promise<string> => {
    try {
      console.log('Making AI prediction request with metadata:', questionObj.metadata);
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ESV: questionObj.metadata.ESV,
          EDV: questionObj.metadata.EDV,
          FrameHeight: questionObj.metadata.FrameHeight,
          FrameWidth: questionObj.metadata.FrameWidth,
          FPS: questionObj.metadata.FPS,
          NumberOfFrames: questionObj.metadata.NumberOfFrames,
        }),
      });

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error('Prediction API failed');
      }

      const data = await response.json();
      console.log('AI API response:', data);
      return data.prediction;
    } catch (error) {
      console.error('API error:', error);
      // Return a random answer as fallback for now
      const possibleAnswers = ["Normal", "Reduced", "Abnormal"];
      const randomAnswer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
      console.log('Using random fallback answer:', randomAnswer);
      return randomAnswer;
    }
  };

  // Select answer function
  const selectAnswer = (selectedAnswer: string) => {
    if (answerSelected) return; // Prevent multiple selections
    
    setSelectedAnswer(selectedAnswer);
    setAnswerSelected(true);
    const question = currentQuestion;
    const correctAnswer = question.correct;
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage("Correct answer! 🎉");
    } else {
      setFeedbackMessage(`Wrong answer. Correct answer was: ${correctAnswer}`);
      
      // Generate explanation based on correct answer
      let explanation = "";
      if (correctAnswer === "Normal") {
        explanation = "Normal left ventricular ejection fraction is typically between 50-70%. Values in this range indicate good cardiac pumping function.";
      } else if (correctAnswer === "Reduced") {
        explanation = "Reduced ejection fraction (typically <40%) indicates impaired left ventricular systolic function, often associated with heart failure.";
      } else if (correctAnswer === "Abnormal") {
        explanation = "This echocardiogram shows abnormal cardiac function that doesn't fit the normal parameters, requiring further clinical evaluation.";
      }

      setIncorrectAnswers(prev => [...prev, {
        question: question.question,
        selected: selectedAnswer,
        correct: correctAnswer,
        explanation: explanation
      }]);
    }

    // Don't show next button immediately - wait for AI prediction
    // setShowNextButton(true);

    // Get AI answer and wait for it to complete before showing next button
    console.log('Getting AI prediction for question:', question.question);
    setPendingAiPredictions(prev => prev + 1); // Increment pending count
    getAIAnswer(question)
      .then(aiAnswer => {
        console.log('AI prediction result:', aiAnswer, 'Correct answer:', correctAnswer);
        const aiCorrect = aiAnswer === correctAnswer;
        if (aiCorrect) {
          console.log('AI got it correct! Updating AI score');
          setAiScore(prev => prev + 1);
        } else {
          console.log('AI got it wrong. AI said:', aiAnswer, 'Correct was:', correctAnswer);
        }
        // Now show the next button after AI prediction is complete
        setShowNextButton(true);
      })
      .catch(error => {
        console.error('AI prediction error:', error);
        // Still show next button even if AI prediction fails
        setShowNextButton(true);
      })
      .finally(() => {
        setPendingAiPredictions(prev => prev - 1); // Decrement pending count when done
      });
  };

  // Next question function
  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      // All AI predictions are already complete since we wait for each one
      console.log('Quiz complete. Final AI score:', aiScore);
      setFinalAiScore(aiScore);
      setShowCompletionPopup(true);
      saveResults();
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswerSelected(false);
      setSelectedAnswer(null);
      setFeedbackMessage("");
      setShowNextButton(false);
    }
  };

  // Function to proceed to results screen
  const proceedToResults = () => {
    setShowCompletionPopup(false);
    setQuizEnded(true);
  };

  // Save results
  const saveResults = async () => {
    try {
      const userID = getUserID();
      const result = {
        userID,
        score,
        ai_score: aiScore,
        total: questions.length,
        timestamp: new Date().toLocaleString()
      };

      const response = await fetch("/api/submit_results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (response.ok) {
        console.log("Results saved successfully");
      }
    } catch (error) {
      console.error("Failed to save results:", error);
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    setStarted(false);
    setQuizEnded(false);
    setCurrentIndex(0);
    setScore(0);
    setAiScore(0);
    setFinalAiScore(0);
    setPendingAiPredictions(0); // Reset pending predictions counter
    setAnswerSelected(false);
    setSelectedAnswer(null);
    setFeedbackMessage("");
    setShowNextButton(false);
    setIncorrectAnswers([]);
    setPlaybackSpeed(1.0);
    setStartTime(null);
    setElapsedTime('0:00');
    setCurrentTime('0:00');
    setShowCompletionPopup(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        {/* Start Screen - Responsive */}
        {!started && !quizEnded && (
          <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 pb-8 sm:pb-16">
            <Card className="text-center p-4 sm:p-8 shadow-elegant max-w-4xl w-full">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">{title}</CardTitle>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-8">Press the button to start the test!</p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={startQuiz}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-red hover:shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  Start the test
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading Screen */}
        {loading && (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="text-center p-8 shadow-elegant">
              <CardContent className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-lg">Loading questions, please wait...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Screen */}
        {started && !quizEnded && !showCompletionPopup && currentQuestion && (
          <div className="min-h-screen bg-gray-50">
            {/* Top Header - Responsive */}
            <div className="bg-white border-b shadow-sm">
              <div className="w-full px-2 sm:px-4 py-2">
                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  {/* Top row - Exit and Title */}
                  <div className="flex items-center justify-between mb-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => window.location.href = '/'}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm px-2 py-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Exit Quiz</span>
                    </Button>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 text-center flex-1 mx-2">
                      Cardiac Quiz
                    </h1>
                    <div className="flex items-center gap-1 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-mono text-sm">{currentTime}</span>
                    </div>
                  </div>
                  
                  {/* Bottom row - Scores */}
                  <div className="flex items-center justify-center gap-6 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600">You</span>
                      <span className="text-lg font-bold text-red-600">{score}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-red-600">🤖</span>
                      </div>
                      <span className="text-xs text-gray-600">AI</span>
                      <span className="text-lg font-bold text-red-600">{aiScore}</span>
                      {pendingAiPredictions > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-600">({pendingAiPredictions})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between">
                  {/* Left side - Exit and Title */}
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => window.location.href = '/'}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-base px-3 py-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Exit Quiz
                    </Button>
                    <h1 className="text-2xl font-semibold text-gray-900">Cardiac Assessment Quiz</h1>
                  </div>

                  {/* Right side - Timer and Scores */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-mono text-base">{currentTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">You</span>
                        <span className="text-xl font-bold text-red-600">{score}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm text-red-600">🤖</span>
                        </div>
                        <span className="text-sm text-gray-600">AI</span>
                        <span className="text-xl font-bold text-red-600">{aiScore}</span>
                        {pendingAiPredictions > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-yellow-600">({pendingAiPredictions})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar - Enhanced and Responsive */}
                <div className="mt-3 mb-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-700 mb-2">
                    <span className="font-medium">Question {currentIndex + 1}/{questions.length}</span>
                    <span className="font-semibold">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="w-full p-2 sm:p-4">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 h-full">
                {/* Left Side - Question and Video */}
                <div className="space-y-3 lg:space-y-4 order-1 lg:order-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 px-2 lg:px-0">
                    {currentQuestion.question}
                  </h2>
                  
                  <Card className="overflow-hidden shadow-lg">
                    <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                      <span className="text-xs sm:text-sm text-gray-600">Echocardiogram</span>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <span className="text-xs text-gray-500 self-center">Speed:</span>
                        {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => changePlaybackSpeed(speed)}
                            className={`px-1.5 sm:px-2 py-1 text-xs rounded ${
                              playbackSpeed === speed 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-black aspect-video relative">
                      {currentQuestion.videoUrl && (
                        <video 
                          ref={videoRef}
                          key={currentIndex} 
                          controls 
                          className="w-full h-full object-contain"
                          style={{ backgroundColor: 'black' }}
                          onLoadedMetadata={() => {
                            if (videoRef.current) {
                              videoRef.current.playbackRate = playbackSpeed;
                            }
                          }}
                        >
                          <source src={currentQuestion.videoUrl} type="video/mp4" />
                          Your browser does not support video.
                        </video>
                      )}
                    </div>
                  </Card>

                  {/* Video Metadata Display - Responsive */}
                  {currentQuestion?.videoUrl && (() => {
                    const metadata = getVideoMetadata(currentQuestion.videoUrl);
                    
                    return (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-2 sm:px-3 py-2 shadow-sm">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                          {metadata.frameNumbers.length > 0 ? (
                            <>
                              <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-m font-medium text-blue-900">Frames</span>
                              </div>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="bg-white bg-opacity-80 px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-blue-200">
                                  <span className="text-m sm:text-sm font-medium text-blue-700">ES</span>
                                  <span className="text-m sm:text-lg font-bold text-blue-900 ml-1">{metadata.frameNumbers[0]}</span>
                                </div>
                                <div className="text-blue-400 text-xs sm:text-sm">•</div>
                                <div className="bg-white bg-opacity-80 px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-blue-200">
                                  <span className="text-xs sm:text-sm font-medium text-blue-700">ED</span>
                                  <span className="text-sm sm:text-lg font-bold text-blue-900 ml-1">{metadata.frameNumbers[1]}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-red-700">No frame data</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Right Side - Answer Selection - Responsive */}
                <div className="space-y-3 lg:space-y-4 order-2 lg:order-2">
                  <div className="px-2 lg:px-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      Select Your Answer
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Choose the most appropriate diagnosis based on the echocardiogram
                    </p>
                  </div>

                  {/* Answer Options - Responsive */}
                  <div className="space-y-2 px-2 lg:px-0">
                    {currentQuestion.answers.map((answer, index) => {
                      const isUserSelected = selectedAnswer === answer;
                      const isCorrect = answer === currentQuestion.correct;
                      const showCorrect = answerSelected && isCorrect;
                      const showIncorrect = answerSelected && isUserSelected && !isCorrect;
                      const letters = ['A', 'B', 'C'];
                      
                      return (
                        <div
                          key={index}
                          className={`border-2 rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-200 ${
                            showCorrect
                              ? 'border-green-500 bg-green-50' 
                              : showIncorrect
                              ? 'border-red-500 bg-red-50'
                              : isUserSelected && !answerSelected
                              ? 'border-blue-500 bg-blue-50'
                              : answerSelected
                              ? 'border-gray-300 bg-gray-50 opacity-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          onClick={() => !answerSelected && selectAnswer(answer)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                showCorrect
                                  ? 'bg-green-500 text-white' 
                                  : showIncorrect
                                  ? 'bg-red-500 text-white'
                                  : isUserSelected && !answerSelected
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {letters[index]}
                              </div>
                              <span className={`font-medium text-xs sm:text-sm ${
                                showCorrect
                                  ? 'text-green-700' 
                                  : showIncorrect
                                  ? 'text-red-700'
                                  : isUserSelected && !answerSelected
                                  ? 'text-blue-700'
                                  : 'text-gray-900'
                              }`}>
                                {answer}
                              </span>
                            </div>
                            
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${
                              showCorrect
                                ? 'border-green-500 bg-green-500' 
                                : showIncorrect
                                ? 'border-red-500 bg-red-500'
                                : isUserSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            } flex items-center justify-center`}>
                              {(showCorrect || showIncorrect || isUserSelected) && (
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cardiac Phase Images - Containers Fit Image Size */}
                  <div className="space-y-2 px-2 lg:px-0">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">Cardiac Phases</h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* Systolic Image */}
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg inline-block overflow-hidden">
                          <img 
                            src="/sistole1273.png" 
                            alt="Systolic phase" 
                            className="block rounded-lg max-w-full h-auto"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-20 h-20 items-center justify-center text-gray-500">
                            <span className="text-xs sm:text-sm text-gray-500">Systolic Phase</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">Systolic</p>
                      </div>

                      {/* Diastolic Image */}
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg inline-block overflow-hidden">
                          <img 
                            src="/diastole1.png" 
                            alt="Diastolic phase" 
                            className="block rounded-lg max-w-full h-auto"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-20 h-20 items-center justify-center text-gray-500">
                            <span className="text-xs sm:text-sm text-gray-500">Diastolic Phase</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">Diastolic</p>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Message - Responsive */}
                  {feedbackMessage && (
                    <div className={`p-2 sm:p-3 rounded-lg mx-2 lg:mx-0 ${
                      feedbackMessage.includes('Correct') 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      <p className="font-medium text-xs sm:text-sm">{feedbackMessage}</p>
                    </div>
                  )}

                  {/* Submit Button - Responsive */}
                  <div className="px-2 lg:px-0">
                    {showNextButton ? (
                      <Button 
                        onClick={nextQuestion}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base"
                      >
                        {currentIndex + 1 >= questions.length ? "View Results" : "Next question"}
                      </Button>
                    ) : pendingAiPredictions > 0 ? (
                      <Button 
                        disabled
                        className="w-full bg-yellow-500 text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        AI is thinking...
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        className="w-full bg-gray-300 text-gray-500 font-semibold py-2 sm:py-2.5 text-sm sm:text-base cursor-not-allowed"
                      >
                        Next question
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen - Responsive */}
        {quizEnded && (
          <div className="min-h-screen bg-background">
            {/* Header - Responsive */}
            <div className="border-b bg-white">
              <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
                {/* Mobile Layout */}
                <div className="flex flex-col sm:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => window.location.href = '/'}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm px-2 py-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden xs:inline">Back</span>
                    </Button>
                    <h1 className="text-lg font-semibold text-center flex-1">Assessment Results</h1>
                    <div className="w-16"></div> {/* Spacer for centering */}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Button>
                  <h1 className="text-xl font-semibold">Assessment Results</h1>
                  <div className="w-24"></div> {/* Spacer for centering */}
                </div>
              </div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl space-y-4 sm:space-y-8">
              {/* Score Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {/* Your Score */}
                <Card className="text-center p-3 sm:p-6">
                  <CardContent className="space-y-2 sm:space-y-4 pt-3 sm:pt-6">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 text-blue-600">
                      <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium text-sm sm:text-base">Your Score</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-2xl sm:text-4xl font-bold text-blue-600">{score}/{questions.length}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {Math.round((score / questions.length) * 100)}% Accuracy
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Score */}
                <Card className="text-center p-3 sm:p-6">
                  <CardContent className="space-y-2 sm:space-y-4 pt-3 sm:pt-6">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 text-purple-600">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">AI</span>
                      </div>
                      <span className="font-medium text-sm sm:text-base">AI Score</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-2xl sm:text-4xl font-bold text-purple-600">{finalAiScore}/{questions.length}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {Math.round((finalAiScore / questions.length) * 100)}% Accuracy
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Time Elapsed */}
                <Card className="text-center p-3 sm:p-6 col-span-1 sm:col-span-2 lg:col-span-1">
                  <CardContent className="space-y-2 sm:space-y-4 pt-3 sm:pt-6">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-600">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium text-sm sm:text-base">Time Elapsed</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-2xl sm:text-4xl font-bold text-green-600">{elapsedTime}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Total Duration</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Summary - Responsive */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Correct Answers */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm sm:text-base">Correct Answers</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {score} out of {questions.length} questions
                        </div>
                      </div>
                    </div>

                    {/* Incorrect Answers */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm sm:text-base">Incorrect Answers</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {incorrectAnswers.length} question{incorrectAnswers.length !== 1 ? 's' : ''} to review
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Comparison */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <div className="font-medium mb-2 text-sm sm:text-base">Comparison with AI Assistant</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {score > finalAiScore && `Great job! You scored ${score - finalAiScore} point${score - finalAiScore !== 1 ? 's' : ''} higher than the AI.`}
                      {score < finalAiScore && `Good effort! The AI scored ${finalAiScore - score} point${finalAiScore - score !== 1 ? 's' : ''} higher.`}
                      {score === finalAiScore && `Excellent! You matched the AI's performance exactly.`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Incorrect Answers - Responsive */}
              {incorrectAnswers.length > 0 && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Review Incorrect Answers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {incorrectAnswers.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg mb-3 sm:mb-4 last:mb-0">
                          <AccordionTrigger className="px-3 sm:px-4 py-2 sm:py-3 hover:no-underline">
                            <div className="flex items-center gap-2 text-left">
                              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                              <span className="font-medium text-sm sm:text-base">Question {index + 1}: {item.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                            <div className="space-y-3 sm:space-y-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                {/* Your Answer */}
                                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-red-900 text-sm sm:text-base">Your Answer</div>
                                    <div className="text-red-700 text-xs sm:text-sm">{item.selected}</div>
                                  </div>
                                </div>

                                {/* Correct Answer */}
                                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-green-900 text-sm sm:text-base">Correct Answer</div>
                                    <div className="text-green-700 text-xs sm:text-sm">{item.correct}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Explanation */}
                              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Explanation</div>
                                <div className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                                  {item.explanation || `The correct answer is "${item.correct}". This is based on standard medical diagnostic criteria for echocardiogram interpretation.`}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
                <Button 
                  onClick={restartQuiz}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base"
                >
                  Take Quiz Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 font-medium text-sm sm:text-base"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Completion Popup Modal - Responsive */}
      {showCompletionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 overflow-hidden transform animate-pulse">
            {/* Popup Content */}
            <div className="p-6 sm:p-8 text-center">
              {score > finalAiScore ? (
                // User Won - Beat the AI
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="text-4xl sm:text-6xl animate-bounce">🎉</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-600 animate-pulse">
                      YOU WON! 🏆
                    </h2>
                    <p className="text-lg sm:text-xl text-green-700 font-semibold">
                      Congratulations! You beat the AI!
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      Your Score: {score}/{questions.length} • AI Score: {finalAiScore}/{questions.length}
                    </p>
                  </div>
                  <div className="flex space-x-2 justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              ) : score === finalAiScore ? (
                // Tie - Same score as AI
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="text-4xl sm:text-6xl animate-pulse">🤝</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 animate-pulse">
                      IT'S A TIE! 🤝
                    </h2>
                    <p className="text-lg sm:text-xl text-blue-700 font-semibold">
                      Wow! You matched the AI exactly!
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      Both scored: {score}/{questions.length} - Amazing performance!
                    </p>
                  </div>
                  <div className="flex space-x-2 justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              ) : (
                // AI Won - AI scored higher
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="text-4xl sm:text-6xl animate-pulse">😔</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-400 rounded-full opacity-20 animate-ping"></div>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 animate-pulse">
                      AI Won! 🤖
                    </h2>
                    <p className="text-lg sm:text-xl text-red-700 font-semibold">
                      The AI scored higher this time!
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      Your Score: {score}/{questions.length} • AI Score: {finalAiScore}/{questions.length}
                    </p>
                  </div>
                  <div className="flex space-x-2 justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}

              {/* See Results Button - Responsive */}
              <div className="mt-6 sm:mt-8">
                <Button 
                  onClick={proceedToResults}
                  className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    score > finalAiScore 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl' 
                      : score === finalAiScore
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  See Results 📊
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer - Responsive */}
      <footer className="bg-muted border-t py-2 sm:py-3 px-3 sm:px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Data Mining • Johannes Gutenberg University • Mainz, Germany
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuizPageOriginal;
