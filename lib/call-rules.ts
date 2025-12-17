// Call Rules: Ethics / Budget / Blacklist
// CURSOR_SEED.md: 迷惑電話化を防ぐための厳格なルール

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Call Ethics: 勧誘・営業と誤認されないための前置き
export function addCallEthicsPrefix(purpose: string): string {
  return `こんにちは。私は個人のAIアシスタントYohakuです。
ユーザーの${purpose}の依頼を代行しています。
この通話は営業や勧誘ではありません。`;
}

// Call Budget: 1日あたりの通話回数制限
export async function checkCallBudget(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const callsToday = await prisma.execution.count({
    where: {
      userId,
      action: 'call.place',
      createdAt: {
        gte: today,
      },
    },
  });

  const dailyLimit = parseInt(process.env.YOHAKU_DAILY_CALL_LIMIT || '10', 10);
  
  if (callsToday >= dailyLimit) {
    return {
      allowed: false,
      reason: `1日の通話上限（${dailyLimit}回）に達しました。明日再度お試しください。`,
    };
  }

  return { allowed: true };
}

// Blacklist: ユーザーが通話を禁止した番号
export async function isPhoneBlacklisted(userId: string, phone: string): Promise<boolean> {
  const blacklisted = await prisma.blacklist.findFirst({
    where: {
      userId,
      phone,
      type: 'phone',
    },
  });

  return !!blacklisted;
}

// Blacklist: 番号を追加
export async function addToBlacklist(userId: string, phone: string, reason?: string): Promise<void> {
  await prisma.blacklist.create({
    data: {
      userId,
      phone,
      type: 'phone',
      reason: reason || 'User requested',
    },
  });
}

// Call Rules統合チェック
export async function validateCallRequest(
  userId: string,
  phone: string,
  purpose: string
): Promise<{ allowed: boolean; reason?: string }> {
  // 1. Blacklistチェック
  if (await isPhoneBlacklisted(userId, phone)) {
    return {
      allowed: false,
      reason: 'この番号への通話はブロックされています。',
    };
  }

  // 2. Budgetチェック
  const budgetCheck = await checkCallBudget(userId);
  if (!budgetCheck.allowed) {
    return budgetCheck;
  }

  // 3. 営業時間チェック（深夜・早朝は避ける）
  const hour = new Date().getHours();
  if (hour < 9 || hour >= 21) {
    return {
      allowed: false,
      reason: '営業時間外（9:00-21:00）のため、通話できません。',
    };
  }

  return { allowed: true };
}


