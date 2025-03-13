import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StreamVibe - Watch Movies Online',
  description: 'Stream your favorite movies and TV shows anytime, anywhere.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f172a] text-white min-h-screen flex flex-col`}>
        <Navbar />
        <div className="pt-16 flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
} 