export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. はじめに</h2>
          <p>
            InnerVoice（以下「当サービス」）は、ユーザーのプライバシーを最重視します。
            本ポリシーでは、当サービスでの情報の取り扱いについて説明します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. 収集する情報</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>入力テキスト</strong>: 提案生成のための要約のみ保存（原文は保存しません）</li>
            <li><strong>利用統計</strong>: Minutes-Back、操作回数等の匿名化された利用データ</li>
            <li><strong>技術情報</strong>: IPアドレス、ブラウザ情報（ハッシュ化して保存）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. 情報の利用目的</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>サービスの提供・改善</li>
            <li>利用統計の分析</li>
            <li>システムの安定性向上</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. データの保護</h2>
          <p>
            すべてのデータは暗号化され、アクセス制御により保護されています。
            第三者への提供は行いません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. データの削除</h2>
          <p>
            ユーザーは設定画面からいつでもデータの削除を要求できます。
            要求から48時間以内にすべてのデータを削除します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. お問い合わせ</h2>
          <p>
            プライバシーに関するご質問は、アプリ内のフィードバック機能からお寄せください。
          </p>
        </section>

        <div className="mt-8 text-sm text-gray-500">
          最終更新: 2024年12月1日
        </div>
      </div>
    </div>
  );
}
