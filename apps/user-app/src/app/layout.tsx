import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SADAK - Travel Privileges Platform',
  description: 'Your travel privileges, all in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
