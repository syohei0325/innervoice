import { z } from 'zod';

// DSPL (Display-Specific Language) - NLUI×GUIの連続体
// LLMが生成するConfirm Sheetの構成スキーマ

export const DSPLBadgeSchema = z.object({
  label: z.string(),
  variant: z.enum(['info', 'success', 'warning', 'danger']).optional(),
});

export const DSPLRiskItemSchema = z.object({
  label: z.string(),
  level: z.enum(['low', 'medium', 'high']),
  description: z.string().optional(),
});

export const DSPLAlternativeSchema = z.object({
  label: z.string(),
  action: z.string(), // e.g., "replan(10:45)"
});

export const DSPLSectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('summary'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('risks'),
    items: z.array(DSPLRiskItemSchema),
  }),
  z.object({
    type: z.literal('alternatives'),
    items: z.array(DSPLAlternativeSchema),
  }),
  z.object({
    type: z.literal('actions'),
    items: z.array(z.object({
      action: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    })),
  }),
]);

export const ConfirmSheetSchema = z.object({
  title: z.string(),
  badges: z.array(z.union([z.string(), DSPLBadgeSchema])).optional(),
  sections: z.array(DSPLSectionSchema),
  irreversible: z.boolean().optional(), // Irreversibility Gate
  requiresDoubleApproval: z.boolean().optional(), // 二重承認が必要
  warmTransferRequired: z.boolean().optional(), // 人間への引き継ぎが必要
});

export const DSPLResponseSchema = z.object({
  confirm_sheet: ConfirmSheetSchema,
});

// TypeScript 型定義
export type DSPLBadge = z.infer<typeof DSPLBadgeSchema>;
export type DSPLRiskItem = z.infer<typeof DSPLRiskItemSchema>;
export type DSPLAlternative = z.infer<typeof DSPLAlternativeSchema>;
export type DSPLSection = z.infer<typeof DSPLSectionSchema>;
export type ConfirmSheet = z.infer<typeof ConfirmSheetSchema>;
export type DSPLResponse = z.infer<typeof DSPLResponseSchema>;

// Irreversibility Gate - 不可逆操作の検出
export function detectIrreversibility(actions: any[]): {
  irreversible: boolean;
  requiresDoubleApproval: boolean;
  warmTransferRequired: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  let irreversible = false;
  let requiresDoubleApproval = false;
  let warmTransferRequired = false;

  for (const action of actions) {
    // 支払い
    if (action.action === 'pay.authorize' || action.amount_yen > 0) {
      irreversible = true;
      requiresDoubleApproval = true;
      warmTransferRequired = true;
      reasons.push('payment');
    }

    // 本人確認
    if (action.requires_identity_verification || action.action === 'identity.verify') {
      irreversible = true;
      requiresDoubleApproval = true;
      warmTransferRequired = true;
      reasons.push('identity_verification');
    }

    // 規約変更
    if (action.action === 'terms.accept' || action.action === 'contract.sign') {
      irreversible = true;
      requiresDoubleApproval = true;
      warmTransferRequired = true;
      reasons.push('terms_change');
    }

    // キャンセル不可の操作
    if (action.non_cancellable === true) {
      irreversible = true;
      requiresDoubleApproval = true;
      reasons.push('non_cancellable');
    }

    // 通話（Call Consent必須）
    if (action.action === 'call.place') {
      requiresDoubleApproval = true;
      reasons.push('call_consent');
    }
  }

  return {
    irreversible,
    requiresDoubleApproval,
    warmTransferRequired,
    reasons,
  };
}

// DSPL生成ヘルパー（LLMを使わないフォールバック）
export function generateFallbackConfirmSheet(
  plan: any,
  irreversibilityCheck: ReturnType<typeof detectIrreversibility>
): ConfirmSheet {
  const badges: string[] = [];
  
  if (irreversibilityCheck.irreversible) {
    badges.push('⚠️ 不可逆操作');
  }
  if (irreversibilityCheck.requiresDoubleApproval) {
    badges.push('🔐 二重承認必須');
  }
  if (irreversibilityCheck.warmTransferRequired) {
    badges.push('👤 人間確認必要');
  }

  const sections: DSPLSection[] = [
    {
      type: 'summary',
      text: plan.summary || '以下のアクションを実行します',
    },
  ];

  if (irreversibilityCheck.reasons.length > 0) {
    sections.push({
      type: 'risks',
      items: irreversibilityCheck.reasons.map(reason => ({
        label: getRiskLabel(reason),
        level: 'high' as const,
        description: getRiskDescription(reason),
      })),
    });
  }

  sections.push({
    type: 'actions',
    items: plan.actions.map((action: any) => ({
      action: action.action,
      description: getActionDescription(action),
      icon: getActionIcon(action.action),
    })),
  });

  return {
    title: plan.summary || '実行プランの確認',
    badges,
    sections,
    irreversible: irreversibilityCheck.irreversible,
    requiresDoubleApproval: irreversibilityCheck.requiresDoubleApproval,
    warmTransferRequired: irreversibilityCheck.warmTransferRequired,
  };
}

function getRiskLabel(reason: string): string {
  const labels: Record<string, string> = {
    payment: '支払いが発生します',
    identity_verification: '本人確認が必要です',
    terms_change: '規約への同意が必要です',
    non_cancellable: 'キャンセルできません',
    call_consent: '通話を開始します',
  };
  return labels[reason] || reason;
}

function getRiskDescription(reason: string): string {
  const descriptions: Record<string, string> = {
    payment: 'この操作は支払いを伴うため、実行後の取り消しができません。',
    identity_verification: '本人確認情報の提供が必要です。オペレーターに引き継がれます。',
    terms_change: '規約や契約への同意が必要です。内容を確認してください。',
    non_cancellable: 'この操作は実行後にキャンセルできません。',
    call_consent: '電話をかけます。通話内容は要約のみ保存されます（録音は既定OFF）。',
  };
  return descriptions[reason] || '';
}

function getActionDescription(action: any): string {
  switch (action.action) {
    case 'calendar.create':
      return `${action.title} - ${action.start?.split('T')[1]?.slice(0, 5)} (${action.duration_min}分)`;
    case 'message.send':
      return `${action.to} に「${action.text}」`;
    case 'reminder.create':
      return `${action.time?.split('T')[1]?.slice(0, 5)} - ${action.note}`;
    case 'call.place':
      return `${action.to} に電話（${action.script?.substring(0, 30)}...）`;
    case 'pay.authorize':
      return `¥${action.amount_yen?.toLocaleString()} の支払い`;
    default:
      return JSON.stringify(action);
  }
}

function getActionIcon(actionType: string): string {
  const icons: Record<string, string> = {
    'calendar.create': '📅',
    'message.send': '💬',
    'reminder.create': '⏰',
    'call.place': '📞',
    'pay.authorize': '💳',
    'places.search': '🔍',
    'reservations.book': '🍽️',
    'parking.reserve': '🅿️',
    'ride.order': '🚗',
  };
  return icons[actionType] || '🔹';
}


















