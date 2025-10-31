import './globals.css'

export const metadata = {
  title: 'Arise :AI Brainstorming and Strategy Generator Tool',
  description: 'Contextual ideas powered by AI that understands your business',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}