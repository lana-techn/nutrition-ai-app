import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "NutriAI - AI-Powered Nutrition Assistant",
  description: "Get personalized nutrition recommendations, analyze food photos, and plan your meals with AI-powered insights.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
