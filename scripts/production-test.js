#!/usr/bin/env node
// 本番環境スモークテスト
const https = require('https');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://your-app.vercel.app';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, PRODUCTION_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'InnerVoice-ProductionTest/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runProductionTests() {
  console.log('🚀 InnerVoice 本番環境スモークテスト開始...\n');

  const tests = [
    {
      name: 'ホームページ読み込み',
      test: async () => {
        const response = await makeRequest('/');
        if (response.status !== 200) {
          throw new Error(`Expected 200, got ${response.status}`);
        }
        if (!response.body.includes('InnerVoice')) {
          throw new Error('ページにInnerVoiceタイトルが含まれていません');
        }
      }
    },
    {
      name: 'プライバシーポリシーページ',
      test: async () => {
        const response = await makeRequest('/privacy');
        if (response.status !== 200) {
          throw new Error(`Expected 200, got ${response.status}`);
        }
      }
    },
    {
      name: 'API - 提案生成',
      test: async () => {
        const response = await makeRequest('/api/propose', 'POST', {
          text: 'テスト用タスク 30分',
          context: { tz: 'Asia/Tokyo' }
        });
        
        if (response.status !== 200) {
          throw new Error(`API エラー: ${response.status}`);
        }
        
        const data = JSON.parse(response.body);
        if (!data.proposals || data.proposals.length !== 2) {
          throw new Error('提案が2つ生成されていません');
        }
        
        console.log(`   レスポンス時間: ${data.latency_ms}ms`);
        if (data.latency_ms > 3000) {
          console.warn('   ⚠️ レスポンス時間が3秒を超えています');
        }
      }
    },
    {
      name: 'API - レート制限テスト',
      test: async () => {
        const requests = [];
        for (let i = 0; i < 12; i++) {
          requests.push(makeRequest('/api/propose', 'POST', {
            text: `レート制限テスト ${i}`,
            context: {}
          }));
        }
        
        const responses = await Promise.all(requests);
        const rateLimited = responses.filter(r => r.status === 429);
        
        if (rateLimited.length === 0) {
          console.warn('   ⚠️ レート制限が機能していない可能性があります');
        } else {
          console.log(`   ✅ レート制限動作確認: ${rateLimited.length}件制限`);
        }
      }
    },
    {
      name: '環境変数確認',
      test: async () => {
        // APIエラーレスポンスから環境変数の設定状況を推測
        const response = await makeRequest('/api/propose', 'POST', {
          text: '', // 空文字でバリデーションエラー発生
          context: {}
        });
        
        if (response.status !== 400) {
          throw new Error('入力値検証が機能していません');
        }
        
        const errorData = JSON.parse(response.body);
        if (errorData.error.includes('OPENAI_API_KEY')) {
          throw new Error('OpenAI API キーが設定されていません');
        }
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    process.stdout.write(`${test.name}... `);
    try {
      await test.test();
      console.log('✅ PASS');
      passed++;
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 結果: ${passed}件成功, ${failed}件失敗`);
  
  if (failed === 0) {
    console.log('🎉 すべてのテストが成功しました！本番環境は正常に動作しています。');
    process.exit(0);
  } else {
    console.log('🚨 テストに失敗があります。公開前に問題を修正してください。');
    process.exit(1);
  }
}

// 実行
runProductionTests().catch(error => {
  console.error('テスト実行エラー:', error);
  process.exit(1);
});
