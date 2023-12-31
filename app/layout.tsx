import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { Navigation } from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout ({
  children
}: {
    children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link href='https://fonts.googleapis.com/css2?family=Karantina&display=swap' rel='stylesheet' />
        <title> Welcome to trendnado </title>
      </head>
      <body>
        <div id='modal-root' />
        <Navigation />
        {children}
      </body>
    </html>
  )
}
