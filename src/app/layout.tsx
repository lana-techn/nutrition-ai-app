import type { Metadata } from "next"
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
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
      ><StackProvider app={stackClientApp}><StackTheme>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </StackTheme></StackProvider></body>
    </html>
  )
}
