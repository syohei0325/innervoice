-- CreateTable: Action Cloud Phase1 Schema
-- Generated: 2025-12-17
-- Description: Exit-first / Action Cloud の初期スキーマ

-- Note: このマイグレーションは既存のデータベースに適用済み（db push）
-- 今後の変更は migrate dev で管理する

-- Tenants
CREATE TABLE IF NOT EXISTS "tenants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'JP',
    "status" TEXT NOT NULL DEFAULT 'active',
    "frozen_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- (その他のテーブルは既に db push で作成済み)

-- このマイグレーションは記録用
-- 実際のテーブルは既に存在するため、エラーを避けるため IF NOT EXISTS を使用

