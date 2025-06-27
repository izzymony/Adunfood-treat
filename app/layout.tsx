import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/app/context/CartContext"
// Update the import path below to the correct location of the Toaster component.
// For example, if the file is at 'app/components/ui/toaster.tsx', use:
import { Toaster } from '@/components/ui/toaster'
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"


const inter = Inter({ subsets: ["latin"] })

const userId = "demo-user-id" // Replace with real user ID

export const metadata: Metadata = {
  title: "FreshMart - Online Grocery Shopping",
  description: "Shop for fresh groceries online with fast delivery",
}

export default function RootLayout({
 
  children,
}: Readonly<{
  children: React.ReactNode
}> ) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <CartProvider userId={userId}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
