import './globals.css'
import { Inter } from 'next/font/google'
import { getSession } from '@/lib/auth'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MicroBank',
  description: 'Modern Banking Application',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers session={session}>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}