/**
 * Phase Guard - phase1でSEALED機能の実行を禁止
 * 
 * SEALED機能（phase1で実行禁止）:
 * - Phone（call.place実行）
 * - Proactive/Nudge実行
 * - Relationship Graph実行
 * - External Memory import/sync
 * - OS Deep Integrations実行
 * - Marketplace / Connector SDK一般公開
 * - Public /v1/* の一般公開
 */

export type YohakuPhase = 'phase1' | 'phase1_5' | 'phase2' | 'phase3';

export const CURRENT_PHASE: YohakuPhase = (process.env.YOHAKU_PHASE as YohakuPhase) || 'phase1';

// Phase1で許可されるコネクタ
export const CONNECTOR_ALLOWLIST_PHASE1 = ['webhook', 'calendar_hold'];

// Phase1で許可されるアクション
export const ACTION_ALLOWLIST_PHASE1 = [
  'webhook.dispatch',
  'calendar.hold.create',
];

// SEALEDアクション（phase1で実行禁止）
export const SEALED_ACTIONS_PHASE1 = [
  'call.place',
  'call.status',
  'call.summary',
  'nudge.create',
  'nudge.send',
  'relationship.query',
  'memory.import',
  'memory.sync',
  'os.shortcut',
  'os.intent',
  'marketplace.publish',
];

/**
 * アクションがphase1で実行可能かチェック
 */
export function isActionAllowedInPhase(action: string, phase: YohakuPhase = CURRENT_PHASE): boolean {
  if (phase === 'phase1') {
    // phase1はallowlistのみ許可
    return ACTION_ALLOWLIST_PHASE1.includes(action);
  }
  
  if (phase === 'phase1_5') {
    // phase1_5はSEALEDアクション以外を許可
    return !SEALED_ACTIONS_PHASE1.includes(action);
  }
  
  // phase2以降はすべて許可
  return true;
}

/**
 * コネクタがphase1で使用可能かチェック
 */
export function isConnectorAllowedInPhase(connector: string, phase: YohakuPhase = CURRENT_PHASE): boolean {
  if (phase === 'phase1') {
    return CONNECTOR_ALLOWLIST_PHASE1.includes(connector);
  }
  
  // phase1_5以降はすべて許可
  return true;
}

/**
 * Phase Guard Error
 */
export class PhaseGuardError extends Error {
  constructor(
    message: string,
    public action: string,
    public phase: YohakuPhase,
    public code: string = 'SEALED_IN_PHASE'
  ) {
    super(message);
    this.name = 'PhaseGuardError';
  }
}

/**
 * アクションをphase guardでチェック
 * phase1で禁止されている場合はエラーをthrow
 */
export function guardAction(action: string, phase: YohakuPhase = CURRENT_PHASE): void {
  if (!isActionAllowedInPhase(action, phase)) {
    throw new PhaseGuardError(
      `Action "${action}" is SEALED in ${phase}. This action will be available in later phases.`,
      action,
      phase,
      'SEALED_IN_PHASE'
    );
  }
}

/**
 * コネクタをphase guardでチェック
 * phase1で禁止されている場合はエラーをthrow
 */
export function guardConnector(connector: string, phase: YohakuPhase = CURRENT_PHASE): void {
  if (!isConnectorAllowedInPhase(connector, phase)) {
    throw new PhaseGuardError(
      `Connector "${connector}" is not allowed in ${phase}. Only ${CONNECTOR_ALLOWLIST_PHASE1.join(', ')} are available in phase1.`,
      connector,
      phase,
      'CONNECTOR_NOT_ALLOWED_IN_PHASE'
    );
  }
}

/**
 * Phase情報を取得
 */
export function getPhaseInfo() {
  return {
    current: CURRENT_PHASE,
    allowedConnectors: CURRENT_PHASE === 'phase1' ? CONNECTOR_ALLOWLIST_PHASE1 : 'all',
    allowedActions: CURRENT_PHASE === 'phase1' ? ACTION_ALLOWLIST_PHASE1 : 'all (except SEALED)',
    sealedActions: CURRENT_PHASE === 'phase1' ? SEALED_ACTIONS_PHASE1 : [],
  };
}



