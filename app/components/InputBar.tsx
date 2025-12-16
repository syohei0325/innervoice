'use client';

import { useState, useEffect, useRef } from 'react';

interface InputBarProps {
  onInput: (text: string) => void;
  isLoading: boolean;
}

export default function InputBar({ onInput, isLoading }: InputBarProps) {
  const [text, setText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceSupported(true);
      
      // Initialize speech recognition
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setIsListening(false);
        setIsVoiceMode(false);
        
        // Auto-submit after voice input
        setTimeout(() => {
          if (transcript.trim()) {
            onInput(transcript.trim());
            setText('');
          }
        }, 500);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsVoiceMode(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onInput(text.trim());
      setText('');
      // Track event: input_started
    }
  };

  const handleVoiceToggle = () => {
    if (!voiceSupported) {
      alert('お使いのブラウザは音声入力に対応していません。Chrome、Edge、Safariをお試しください。');
      return;
    }

    if (isVoiceMode) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsVoiceMode(false);
      setIsListening(false);
    } else {
      // Start listening
      setIsVoiceMode(true);
      setIsListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          setIsVoiceMode(false);
          setIsListening(false);
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isVoiceMode 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isVoiceMode ? '🎤 音声' : '⌨️ テキスト'}
          </button>
          <span className="text-sm text-gray-500">7秒で入力</span>
        </div>
        
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isVoiceMode ? '音声入力中...' : '明日の午前中で◯◯クリニック予約して'}
            className="input-bar resize-none h-20"
            disabled={isLoading || isVoiceMode}
          />
          {isVoiceMode && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-80 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className={`text-4xl ${isListening ? 'animate-pulse' : ''}`}>🎤</div>
                <div className="text-blue-600 font-medium">
                  {isListening ? '話してください...' : '音声入力準備中...'}
                </div>
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className="text-sm text-blue-500 underline"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!text.trim() || isLoading || isVoiceMode}
          className="w-full confirm-button"
        >
          {isLoading ? 'AI分析中...' : '2つのプランを取得'}
        </button>
      </form>
    </div>
  );
}
