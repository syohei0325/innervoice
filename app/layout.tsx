import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yohaku – 7秒で「決めて、置く」',
  description: 'AIがあなたの代わりに必要な電話を行い、その結果を予定・連絡・リマインドへ1タップで落とし込む。スクリーンから人を解放する相棒。',
  keywords: ['AI', '音声アシスタント', 'カレンダー', '予定管理', '生産性', 'ライフハック'],
  authors: [{ name: 'Yohaku Team' }],
  openGraph: {
    title: 'Yohaku – 7秒で「決めて、置く」',
    description: 'AIがあなたの代わりに必要な電話を行い、その結果を予定・連絡・リマインドへ1タップで落とし込む。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yohaku – 7秒で「決めて、置く」',
    description: 'AIがあなたの代わりに必要な電話を行い、その結果を予定・連絡・リマインドへ1タップで落とし込む。',
  },
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
        <Analytics />
      </body>
    </html>
  );
}
