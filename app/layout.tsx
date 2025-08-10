"use client";
import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";
import React, { useEffect, useState } from "react";




const merriweather = Merriweather({
  subsets: ["latin"]
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={merriweather.className}>
          {/* Botão removido daqui, será adicionado no Header */}
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
