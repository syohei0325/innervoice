export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">利用規約</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. サービス概要</h2>
          <p>
            InnerVoice は、7秒の入力で2つの行動提案を生成し、
            ワンクリックでカレンダーイベントやメッセージ送信を実行できるサービスです。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. 利用条件</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>13歳以上の方が利用可能です</li>
            <li>違法行為や第三者への迷惑行為は禁止です</li>
            <li>商用利用は事前にご相談ください</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. 免責事項</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>サービスの継続性について保証いたしません</li>
            <li>生成される提案の内容について責任を負いません</li>
            <li>外部サービス（Calendar等）の連携障害について責任を負いません</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. 知的財産権</h2>
          <p>
            サービスに関する知的財産権は当社に帰属します。
            ユーザーが入力したデータの権利はユーザーに帰属します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. 規約の変更</h2>
          <p>
            本規約は予告なく変更される場合があります。
            変更後の継続利用をもって同意とみなします。
          </p>
        </section>

        <div className="mt-8 text-sm text-gray-500">
          最終更新: 2024年12月1日
        </div>
      </div>
    </div>
  );
}
