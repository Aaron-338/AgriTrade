import { Inter } from 'next/font/google'
import './globals.css'
import ClientComponents from '@/components/ClientComponents'
import { metadata } from './metadata'

const inter = Inter({ subsets: ['latin'] })

// Metadata is now imported from a separate file

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientComponents>
          {children}
        </ClientComponents>
      </body>
    </html>
  )
} 