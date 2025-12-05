import { z } from 'zod';

// Model Routing Layer - データ分類に基づいた中立的なモデル選択

export enum DataClassification {
  P0 = 'P0', // PII/決済/録音実体
  P1 = 'P1', // 要約/準特定
  P2 = 'P2', // 一般推論
}

export enum Region {
  US = 'US',
  JP = 'JP',
  EU = 'EU',
}

export enum ModelProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  LOCAL = 'local',
  KIMI = 'kimi', // 中国系
  DEEPSEEK = 'deepseek', // 中国系
}

export const ModelRoutingConfigSchema = z.object({
  dataClass: z.nativeEnum(DataClassification),
  region: z.nativeEnum(Region),
  allowChinese: z.boolean().optional(), // 中国系モデルを許可するか（P2のみ）
  preferredProviders: z.array(z.nativeEnum(ModelProvider)).optional(),
});

export type ModelRoutingConfig = z.infer<typeof ModelRoutingConfigSchema>;

export interface ModelRoute {
  provider: ModelProvider;
  model: string;
  endpoint: string;
  reason: string;
}

// Model Routing Engine
export class ModelRouter {
  private static instance: ModelRouter;

  static getInstance(): ModelRouter {
    if (!ModelRouter.instance) {
      ModelRouter.instance = new ModelRouter();
    }
    return ModelRouter.instance;
  }

  /**
   * データ分類とリージョンに基づいて最適なモデルを選択
   */
  route(config: ModelRoutingConfig): ModelRoute {
    const { dataClass, region, allowChinese = false } = config;

    // P0: PII/決済/録音実体 - 信頼できるプロバイダのみ
    if (dataClass === DataClassification.P0) {
      return this.routeP0(region);
    }

    // P1: 要約/準特定 - 匿名化後に価格/遅延で選択
    if (dataClass === DataClassification.P1) {
      return this.routeP1(region, allowChinese);
    }

    // P2: 一般推論 - 最安/最速ルート優先
    return this.routeP2(region, allowChinese);
  }

  private routeP0(region: Region): ModelRoute {
    // P0は信頼プロバイダ固定（OpenAI/Anthropic）
    // 中国系/未審査は不可
    switch (region) {
      case Region.US:
      case Region.JP:
        return {
          provider: ModelProvider.OPENAI,
          model: 'gpt-4o',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          reason: 'P0_TRUSTED_US_JP',
        };
      case Region.EU:
        // EUは越境既定OFF
        return {
          provider: ModelProvider.OPENAI,
          model: 'gpt-4o',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          reason: 'P0_TRUSTED_EU',
        };
      default:
        return {
          provider: ModelProvider.OPENAI,
          model: 'gpt-4o',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          reason: 'P0_DEFAULT',
        };
    }
  }

  private routeP1(region: Region, allowChinese: boolean): ModelRoute {
    // P1は匿名化後に価格/遅延で選択
    // JPは中国系はopt-in
    if (region === Region.JP && !allowChinese) {
      return {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4o-mini',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        reason: 'P1_JP_NO_CHINESE',
      };
    }

    // EUは越境既定OFF
    if (region === Region.EU) {
      return {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4o-mini',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        reason: 'P1_EU_NO_CROSS_BORDER',
      };
    }

    // その他は価格優先
    return {
      provider: ModelProvider.OPENAI,
      model: 'gpt-4o-mini',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      reason: 'P1_COST_OPTIMIZED',
    };
  }

  private routeP2(region: Region, allowChinese: boolean): ModelRoute {
    // P2は最安/最速ルート優先
    if (allowChinese && region === Region.JP) {
      // 中国系モデルを許可（opt-in）
      return {
        provider: ModelProvider.DEEPSEEK,
        model: 'deepseek-chat',
        endpoint: 'https://api.deepseek.com/v1/chat/completions',
        reason: 'P2_JP_CHINESE_OPT_IN',
      };
    }

    // デフォルトは最安のOpenAI
    return {
      provider: ModelProvider.OPENAI,
      model: 'gpt-4o-mini',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      reason: 'P2_DEFAULT_COST',
    };
  }

  /**
   * データ内容からデータ分類を推定
   */
  classifyData(data: any): DataClassification {
    const dataStr = JSON.stringify(data).toLowerCase();

    // P0: PII/決済/録音実体
    const p0Keywords = [
      'email',
      'phone',
      'credit_card',
      'ssn',
      'passport',
      'payment',
      'amount_yen',
      'transcript',
      'recording',
    ];
    if (p0Keywords.some(keyword => dataStr.includes(keyword))) {
      return DataClassification.P0;
    }

    // P1: 要約/準特定
    const p1Keywords = ['summary', 'name', 'address', 'date_of_birth'];
    if (p1Keywords.some(keyword => dataStr.includes(keyword))) {
      return DataClassification.P1;
    }

    // P2: 一般推論
    return DataClassification.P2;
  }

  /**
   * リージョンを取得（環境変数またはデフォルト）
   */
  getRegion(): Region {
    const region = process.env.YOHAKU_REGION || 'JP';
    switch (region.toUpperCase()) {
      case 'US':
        return Region.US;
      case 'EU':
        return Region.EU;
      case 'JP':
      default:
        return Region.JP;
    }
  }

  /**
   * 中国系モデルの許可設定を取得
   */
  getAllowChinese(): boolean {
    return process.env.YOHAKU_ALLOW_CHINESE_MODELS === 'true';
  }
}

export const modelRouter = ModelRouter.getInstance();

// Provider Events記録用ヘルパー
export async function recordProviderEvent(
  userId: string,
  provider: string,
  event: string,
  payload: any
) {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.providerEvent.create({
      data: {
        userId,
        provider,
        event,
        payloadJson: JSON.stringify(payload),
      },
    });
  } catch (error) {
    console.error('Failed to record provider event:', error);
  }
}




