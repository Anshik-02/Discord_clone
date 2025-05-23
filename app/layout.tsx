  import type { Metadata } from "next";
  import { Geist, Open_Sans } from "next/font/google";
  import "./globals.css";
  import { ClerkProvider } from "@clerk/nextjs";
  import { cn } from "@/lib/utils";
  import { ThemeProvider } from "@/components/providers/theme-provider";
  import ModalProvider from "@/components/providers/model-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";


  const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });

  const geistMono = Open_Sans({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });

  export const metadata: Metadata = {
    title: "Discord Clone", 
    description: "Discord Clone",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",}
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (  <ClerkProvider>
      <html lang="en">
      
        <body suppressHydrationWarning
          className={cn(`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#313338] `)}
        >
        
      <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
              storageKey="discord-theme"
            >
              <SocketProvider>
              <ModalProvider/>
              <QueryProvider>
              {children}
              </QueryProvider>
              </SocketProvider>
   
            </ThemeProvider>
        </body>
    
      </html>    </ClerkProvider>
    );
  }
