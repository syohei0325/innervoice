import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InnerVoice',
  description: '7秒で「決めて、置く」。スクリーンから人を解放する相棒',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
