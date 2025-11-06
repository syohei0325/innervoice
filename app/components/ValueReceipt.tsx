'use client';

import { useEffect, useState } from 'react';

type ValueReceiptProps = {
  minutesBack: number;
  frictionSaved: Array<{ type: string; qty: number; evidence: string }>;
  show: boolean;
  onClose: () => void;
};

/**
 * Value Receipt - 軽量トースト（2-3秒）
 * FEA件数が主役、時間は小さく保守的に添える
 */
export default function ValueReceipt({ minutesBack, frictionSaved, show, onClose }: ValueReceiptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // 3秒後に自動で閉じる
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // フェードアウト後にonClose
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  // FEA合計
  const totalFEA = frictionSaved.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">
              ✅ 完了しました
            </p>
            <div className="mt-1 space-y-1">
              {/* FEAが主役 */}
              <p className="text-lg font-bold text-green-800">
                {totalFEA}件の手間を削減
              </p>
              {/* 時間は小さく保守的に */}
              {minutesBack > 0 && (
                <p className="text-xs text-green-600">
                  約{minutesBack}分の節約（保守的推定）
                </p>
              )}
            </div>
            {/* FEA内訳 */}
            <div className="mt-2 text-xs text-green-700 space-y-0.5">
              {frictionSaved.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  <span>{getFEALabel(item.type)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getFEALabel(type: string): string {
  const labels: Record<string, string> = {
    app_switch_avoided: 'アプリ切替を回避',
    copy_paste_avoided: 'コピペを回避',
    typing_avoided_chars: '入力を省略',
    search_avoided: '検索を省略',
    form_fill_avoided: 'フォーム入力を省略',
    call_tree_avoided: '電話メニューを回避',
  };
  return labels[type] || type;
}

