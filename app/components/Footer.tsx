import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">InnerVoice</h3>
            <p className="text-sm text-gray-600">
              7秒で「決めて、置く」。<br />
              スクリーンから人を解放する相棒
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">サービス</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-gray-900">ホーム</Link></li>
              <li><Link href="/#demo" className="hover:text-gray-900">デモ</Link></li>
              <li><Link href="/api/account/export" className="hover:text-gray-900">データエクスポート</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">ポリシー</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy" className="hover:text-gray-900">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900">利用規約</Link></li>
              <li><a href="mailto:feedback@innervoice.app" className="hover:text-gray-900">お問い合わせ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 InnerVoice. We optimize for life-time, not screen-time.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">v0.2.0-alpha.1</span>
              <a 
                href="https://github.com/YOUR_USERNAME/innervoice" 
                className="text-sm text-gray-500 hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
