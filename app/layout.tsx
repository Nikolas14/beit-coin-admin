import Navbar from '@/components/Navbar/Navbar'
import './globals.css'

export const metadata = {
  title: 'Beitcoin Admin',
  description: 'Painel de controle para o sistema de Tzedaká Beitcoin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>
        {/* O conteúdo da página */}
        <div className="pb-20 md:pt-16 md:pb-0"> 
          {children}
        </div>
        
        {/* Barra de navegação fixa */}
        <Navbar />
      </body>
    </html>
  )
}