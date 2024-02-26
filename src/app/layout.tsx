import { Metadata } from 'next'
import Script from 'next/script'

import './globals.css'

export const metadata: Metadata = {
  title: 'Han Park',
  openGraph: {
    title: 'Han Park',
    description: 'Han\'s personal website',
    url: 'https://hanpark.im',
    siteName: 'Han Park',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-black dark:text-white bg-white dark:bg-black">
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`} />
        <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.GA_MEASUREMENT_ID}');
        `}
        </Script>

        {children}
      </body>
    </html>
  )
}
