import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
        {/* Sidebar */}
        <nav style={styles.sidebar}>
          <div style={styles.logo}>Beit<span style={{color: '#FFC947'}}>Coin</span> 🪙</div>
          <div style={styles.menu}>
            <Link href="/" style={styles.navLink}>🏠 Início</Link>
            <Link href="/membros" style={styles.navLink}>👥 Membros / Cartões</Link>
            <Link href="/transacoes" style={styles.navLink}>📜 Transações</Link>
          </div>
        </nav>

        {/* Conteúdo da Página */}
        <main style={{ flex: 1, padding: '40px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}

const styles = {
  sidebar: { width: '260px', backgroundColor: '#0A1931', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column' as const },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' as const },
  menu: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
  navLink: { color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', transition: '0.2s', borderBottom: '1px solid #1a2a44' }
};