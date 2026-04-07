import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Mare Nostrum Mockup',
  description: 'Implementation plan v2 mockup vertical slice',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
