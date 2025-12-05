/**
 * PoEx (Proof-of-Execution): 実行証明
 * 
 * すべての実行に「改ざん不可能な証明」を発行し、
 * 週次でMerkle Rootを透明性ログに掲示する。
 */

import crypto from 'crypto';

/**
 * 実行レシート
 */
export interface ExecutionReceipt {
  receipt_id: string;
  approve_id: string | null;
  plan_id: string | null;
  actions: Array<{
    action: string;
    id: string;
    status: string;
  }>;
  ts: string; // ISO 8601
  device_sig: string | null; // 端末署名（将来実装）
  server_sig: string; // サーバ署名
  merkle_root_week: string; // YYYY-Wxx形式
}

/**
 * サーバ署名を生成
 * 
 * @param data - 署名対象のデータ
 * @returns HMAC-SHA256署名（hex）
 */
export function generateServerSignature(data: Record<string, unknown>): string {
  const secret = process.env.YOHAKU_SERVER_SECRET || 'default-secret-key-change-in-production';
  const payload = JSON.stringify(data);
  
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * サーバ署名を検証
 * 
 * @param data - 検証対象のデータ
 * @param signature - 署名（hex）
 * @returns 検証結果
 */
export function verifyServerSignature(data: Record<string, unknown>, signature: string): boolean {
  const expected = generateServerSignature(data);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex')
  );
}

/**
 * 週番号を取得（ISO 8601形式：YYYY-Wxx）
 * 
 * @param date - 日付（デフォルト：現在）
 * @returns 週番号（例：2025-W45）
 */
export function getWeekNumber(date: Date = new Date()): string {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // 月曜日を0とする
  target.setDate(target.getDate() - dayNr + 3); // 木曜日に移動
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNumber = Math.ceil(((target.getTime() - firstThursday.getTime()) / 86400000 + 1) / 7);
  
  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

/**
 * 実行レシートを生成
 * 
 * @param params - レシート生成パラメータ
 * @returns 実行レシート
 */
export function generateExecutionReceipt(params: {
  receipt_id: string;
  approve_id: string | null;
  plan_id: string | null;
  actions: Array<{
    action: string;
    id: string;
    status: string;
  }>;
  device_sig?: string | null;
}): ExecutionReceipt {
  const now = new Date();
  const ts = now.toISOString();
  const merkle_root_week = getWeekNumber(now);
  
  // 署名対象データ
  const signatureData = {
    receipt_id: params.receipt_id,
    approve_id: params.approve_id,
    plan_id: params.plan_id,
    actions: params.actions,
    ts,
    merkle_root_week,
  };
  
  // サーバ署名を生成
  const server_sig = generateServerSignature(signatureData);
  
  return {
    ...signatureData,
    device_sig: params.device_sig || null,
    server_sig,
  };
}

/**
 * Merkle Tree用のハッシュを生成
 * 
 * @param data - ハッシュ対象のデータ
 * @returns SHA-256ハッシュ（hex）
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Merkle Rootを計算
 * 
 * @param leaves - リーフノード（レシートID配列）
 * @returns Merkle Root（hex）
 */
export function calculateMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) {
    return hash('');
  }
  
  if (leaves.length === 1) {
    return hash(leaves[0]);
  }
  
  // ハッシュ化
  let nodes = leaves.map(leaf => hash(leaf));
  
  // ツリーを構築
  while (nodes.length > 1) {
    const nextLevel: string[] = [];
    
    for (let i = 0; i < nodes.length; i += 2) {
      if (i + 1 < nodes.length) {
        // ペアがある場合
        nextLevel.push(hash(nodes[i] + nodes[i + 1]));
      } else {
        // ペアがない場合（奇数個）、自分自身と結合
        nextLevel.push(hash(nodes[i] + nodes[i]));
      }
    }
    
    nodes = nextLevel;
  }
  
  return nodes[0];
}

/**
 * 週次のMerkle Rootを計算
 * 
 * @param receiptIds - 週内のレシートID配列
 * @returns Merkle Root（hex）
 */
export function calculateWeeklyMerkleRoot(receiptIds: string[]): string {
  return calculateMerkleRoot(receiptIds);
}

/**
 * Merkle Proofを生成（将来実装）
 * 
 * @param receiptId - 証明対象のレシートID
 * @param allReceiptIds - 週内のすべてのレシートID
 * @returns Merkle Proof
 */
export function generateMerkleProof(
  receiptId: string,
  allReceiptIds: string[]
): Array<{ hash: string; position: 'left' | 'right' }> {
  // TODO: 将来実装
  // Merkle Proofを生成して、特定のレシートがMerkle Rootに含まれることを証明
  return [];
}

/**
 * Merkle Proofを検証（将来実装）
 * 
 * @param receiptId - 検証対象のレシートID
 * @param proof - Merkle Proof
 * @param merkleRoot - Merkle Root
 * @returns 検証結果
 */
export function verifyMerkleProof(
  receiptId: string,
  proof: Array<{ hash: string; position: 'left' | 'right' }>,
  merkleRoot: string
): boolean {
  // TODO: 将来実装
  return false;
}

