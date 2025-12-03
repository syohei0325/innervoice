import { z } from 'zod';

// Security KPI - セキュリティ指標の計測と公開

export const SecurityKPISchema = z.object({
  week: z.string(), // "2025-W45"
  vulnOpen: z.number(), // 未修正の脆弱性数
  depsOutdatedAvgDays: z.number(), // 依存関係の平均遅延日数
  secretsIncidents7d: z.number(), // 過去7日間のシークレット漏洩インシデント
  mttrSecurityHours: z.number(), // セキュリティインシデントの平均修復時間（時間）
  sbomCoveragePct: z.number(), // SBOM（Software Bill of Materials）カバレッジ（%）
  subprocNotificationLagHours: z.number(), // サブプロセッサー通知の平均遅延（時間）
  referrerBlockRatePct: z.number(), // Referrer遮断率（%）
});

export type SecurityKPI = z.infer<typeof SecurityKPISchema>;

// Security KPI Tracker
export class SecurityKPITracker {
  private static instance: SecurityKPITracker;

  static getInstance(): SecurityKPITracker {
    if (!SecurityKPITracker.instance) {
      SecurityKPITracker.instance = new SecurityKPITracker();
    }
    return SecurityKPITracker.instance;
  }

  /**
   * 現在のSecurity KPIを計算
   */
  async calculateCurrentKPI(): Promise<SecurityKPI> {
    const week = this.getCurrentWeek();

    // 実際の実装では、各種ツールやログから取得
    // ここではモック値を返す
    return {
      week,
      vulnOpen: await this.getOpenVulnerabilities(),
      depsOutdatedAvgDays: await this.getOutdatedDependenciesAvgDays(),
      secretsIncidents7d: await this.getSecretsIncidentsLast7Days(),
      mttrSecurityHours: await this.getMTTRSecurityHours(),
      sbomCoveragePct: await this.getSBOMCoverage(),
      subprocNotificationLagHours: await this.getSubprocessorNotificationLag(),
      referrerBlockRatePct: await this.getReferrerBlockRate(),
    };
  }

  /**
   * Security KPIをDBに保存
   */
  async saveKPI(kpi: SecurityKPI): Promise<void> {
    try {
      const { prisma } = await import('@/lib/prisma');
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          action: 'security_kpi_snapshot',
          payloadJson: JSON.stringify(kpi),
        },
      });
    } catch (error) {
      console.error('Failed to save security KPI:', error);
    }
  }

  /**
   * 過去のSecurity KPI履歴を取得
   */
  async getKPIHistory(weeks: number = 12): Promise<SecurityKPI[]> {
    try {
      const { prisma } = await import('@/lib/prisma');
      const logs = await prisma.auditLog.findMany({
        where: {
          userId: 'system',
          action: 'security_kpi_snapshot',
        },
        orderBy: {
          at: 'desc',
        },
        take: weeks,
      });

      return logs.map(log => JSON.parse(log.payloadJson) as SecurityKPI);
    } catch (error) {
      console.error('Failed to get KPI history:', error);
      return [];
    }
  }

  // 以下、各指標の計算メソッド（モック実装）

  private async getOpenVulnerabilities(): Promise<number> {
    // TODO: GitHub Security Alerts API / Snyk API等から取得
    return 1;
  }

  private async getOutdatedDependenciesAvgDays(): Promise<number> {
    // TODO: npm outdated / Dependabot等から取得
    return 12;
  }

  private async getSecretsIncidentsLast7Days(): Promise<number> {
    // TODO: GitGuardian / TruffleHog等から取得
    return 0;
  }

  private async getMTTRSecurityHours(): Promise<number> {
    // TODO: インシデント管理システムから取得
    return 18;
  }

  private async getSBOMCoverage(): Promise<number> {
    // TODO: SBOM生成ツール（Syft等）から取得
    return 96;
  }

  private async getSubprocessorNotificationLag(): Promise<number> {
    // TODO: サブプロセッサー変更通知の遅延を計測
    return 12;
  }

  private async getReferrerBlockRate(): Promise<number> {
    // TODO: アクセスログから計測
    return 100;
  }

  private getCurrentWeek(): string {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getWeekNumber(now);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}

export const securityKPITracker = SecurityKPITracker.getInstance();

// AXI (Action eXecution Index) - 実行品質指標
export const AXISchema = z.object({
  week: z.string(), // "2025-W45"
  ttcP50Ms: z.number(), // Time-to-Confirm p50（ms）
  misexecPct: z.number(), // 誤実行率（%）
  cancelSuccessPct: z.number(), // 取消成功率（%）
  rollbackSuccessPct: z.number(), // ロールバック成功率（%）
  callSuccessPct: z.number(), // 通話成功率（%）
  screenOffCompletionPct: z.number(), // Screen-off完了率（%）
});

export type AXI = z.infer<typeof AXISchema>;

// AXI Tracker
export class AXITracker {
  private static instance: AXITracker;

  static getInstance(): AXITracker {
    if (!AXITracker.instance) {
      AXITracker.instance = new AXITracker();
    }
    return AXITracker.instance;
  }

  /**
   * 現在のAXIを計算
   */
  async calculateCurrentAXI(): Promise<AXI> {
    const week = this.getCurrentWeek();

    return {
      week,
      ttcP50Ms: await this.getTTCP50(),
      misexecPct: await this.getMisexecRate(),
      cancelSuccessPct: await this.getCancelSuccessRate(),
      rollbackSuccessPct: await this.getRollbackSuccessRate(),
      callSuccessPct: await this.getCallSuccessRate(),
      screenOffCompletionPct: await this.getScreenOffCompletionRate(),
    };
  }

  /**
   * AXIをDBに保存
   */
  async saveAXI(axi: AXI): Promise<void> {
    try {
      const { prisma } = await import('@/lib/prisma');
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          action: 'axi_snapshot',
          payloadJson: JSON.stringify(axi),
        },
      });
    } catch (error) {
      console.error('Failed to save AXI:', error);
    }
  }

  /**
   * 過去のAXI履歴を取得
   */
  async getKPIHistory(weeks: number = 12): Promise<AXI[]> {
    try {
      const { prisma } = await import('@/lib/prisma');
      const logs = await prisma.auditLog.findMany({
        where: {
          userId: 'system',
          action: 'axi_snapshot',
        },
        orderBy: {
          at: 'desc',
        },
        take: weeks,
      });

      return logs.map(log => JSON.parse(log.payloadJson) as AXI);
    } catch (error) {
      console.error('Failed to get AXI history:', error);
      return [];
    }
  }

  // 以下、各指標の計算メソッド（モック実装）

  private async getTTCP50(): Promise<number> {
    // TODO: audit_logsから実際の値を計算
    return 680;
  }

  private async getMisexecRate(): Promise<number> {
    // TODO: ledger_eventsから計算
    return 0.32;
  }

  private async getCancelSuccessRate(): Promise<number> {
    // TODO: ledger_eventsから計算
    return 97.8;
  }

  private async getRollbackSuccessRate(): Promise<number> {
    // TODO: ledger_eventsから計算
    return 96.4;
  }

  private async getCallSuccessRate(): Promise<number> {
    // TODO: provider_eventsから計算
    return 91.2;
  }

  private async getScreenOffCompletionRate(): Promise<number> {
    // TODO: eventsから計算
    return 72.1;
  }

  private getCurrentWeek(): string {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getWeekNumber(now);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}

export const axiTracker = AXITracker.getInstance();

