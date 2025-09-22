'use client';

import { useState } from 'react';
import { Plan, Action } from '@/lib/intent';

interface ConfirmSheetProps {
  plan: Plan;
  onConfirm: (planId: string, enabledActions: string[]) => void;
  onCancel: () => void;
  isExecuting?: boolean;
}

export default function ConfirmSheet({ 
  plan, 
  onConfirm, 
  onCancel, 
  isExecuting = false 
}: ConfirmSheetProps) {
  const [enabledActions, setEnabledActions] = useState<Set<string>>(
    new Set(plan.actions.map((_, index) => index.toString()))
  );

  const toggleAction = (index: string) => {
    const newEnabled = new Set(enabledActions);
    if (newEnabled.has(index)) {
      newEnabled.delete(index);
    } else {
      newEnabled.add(index);
    }
    setEnabledActions(newEnabled);
  };

  const handleConfirm = () => {
    onConfirm(plan.id, Array.from(enabledActions));
  };

  const getActionIcon = (action: Action) => {
    switch (action.action) {
      case 'calendar.create':
        return '📅';
      case 'message.send':
        return '💬';
      case 'reminder.create':
        return '⏰';
      default:
        return '🔹';
    }
  };

  const getActionDescription = (action: Action) => {
    switch (action.action) {
      case 'calendar.create':
        return `${action.start?.split('T')[1]?.slice(0,5)} - ${action.title} (${action.duration_min}分)`;
      case 'message.send':
        return `${action.to} に「${action.text}」`;
      case 'reminder.create':
        return `${action.time?.split('T')[1]?.slice(0,5)} - ${action.note}`;
      default:
        return JSON.stringify(action);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            実行プランの確認
          </h3>
          <p className="text-gray-600 text-sm">
            {plan.summary}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {plan.actions.map((action, index) => (
            <div 
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${
                enabledActions.has(index.toString()) 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={enabledActions.has(index.toString())}
                onChange={() => toggleAction(index.toString())}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isExecuting}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{getActionIcon(action)}</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {action.action.replace('.', ' → ').replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {getActionDescription(action)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={isExecuting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            disabled={isExecuting || enabledActions.size === 0}
            className="flex-1 confirm-button"
          >
            {isExecuting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                実行中...
              </span>
            ) : (
              `Confirm once（${enabledActions.size}件実行）`
            )}
          </button>
        </div>

        {enabledActions.size === 0 && (
          <p className="text-red-500 text-sm mt-2 text-center">
            ※ 少なくとも1つのアクションを選択してください
          </p>
        )}
      </div>
    </div>
  );
}
