import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Odak — Görev Listesi',
  description: 'Sade ve hızlı görev yönetimi.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
