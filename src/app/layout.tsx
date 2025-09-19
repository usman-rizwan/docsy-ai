import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/lib/convex-provider';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Docsy AI - Transform Your Documents into Conversations',
  description: 'Upload PDFs and chat with your documents using AI. Get instant answers and insights from your files.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
          <body className={inter.className}>
            {children}
              <Toaster richColors position='top-right' />
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}