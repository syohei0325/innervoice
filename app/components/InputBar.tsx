'use client';

import { useState } from 'react';

interface InputBarProps {
  onInput: (text: string) => void;
  isLoading: boolean;
}

export default function InputBar({ onInput, isLoading }: InputBarProps) {
  const [text, setText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onInput(text.trim());
      setText('');
      // Track event: input_started
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceMode(!isVoiceMode);
    // TODO: Implement voice input (for now just toggle UI)
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
            placeholder={isVoiceMode ? '音声入力中...' : '明日朝30分ランニング'}
            className="input-bar resize-none h-20"
            disabled={isLoading || isVoiceMode}
          />
          {isVoiceMode && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-80 flex items-center justify-center rounded-lg">
              <div className="text-blue-600 font-medium">🎤 音声入力モード（TODO: 実装）</div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!text.trim() || isLoading || isVoiceMode}
          className="w-full confirm-button"
        >
          {isLoading ? '提案生成中...' : '2つの提案を取得'}
        </button>
      </form>
    </div>
  );
}
