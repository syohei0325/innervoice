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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isVoiceMode ? '...' : '明日の午前中で田中クリニック予約して'}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none resize-none transition-colors"
            rows={3}
            disabled={isLoading || isVoiceMode}
          />
          {isVoiceMode && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center gap-3">
                <div className={`text-5xl ${isListening ? 'animate-pulse' : ''}`}>🎤</div>
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
          {voiceSupported && !isVoiceMode && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className="absolute right-4 top-4 text-2xl hover:scale-110 transition-transform"
              disabled={isLoading}
            >
              🎤
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!text.trim() || isLoading || isVoiceMode}
          className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '...' : '実行'}
        </button>
      </form>
    </div>
  );
}
