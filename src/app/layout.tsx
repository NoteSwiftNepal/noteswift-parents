import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ParentAuthProvider } from '@/context/parent-auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NoteSwift Parents Portal',
  description: 'Parent dashboard for the NoteSwift platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ParentAuthProvider>
          {children}
        </ParentAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
