'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Link from 'next/link';

interface ITransaction {
  id: string;
  user_name: string;
  amount: number;
  type: 'recharge' | 'debit';
  created_at: string;
}

interface ICard {
  uid: string;
  user_name: string;
  balance: number;
  status: string;
}

export default function HomePage() {
  const [stats, setStats] = useState({ totalMembros: 0, totalSaldo: 0 });
  const [recentTrans, setRecentTrans] = useState<ITransaction[]>([]);
  const [recentMembers, setRecentMembers] = useState<ICard[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: cards } = await supabase.from('cards').select('balance');
      if (cards) {
        const total = cards.reduce((acc, curr) => acc + Number(curr.balance), 0);
        setStats({ totalMembros: cards.length, totalSaldo: total });
      }

      const { data: trans } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5);
      if (trans) setRecentTrans(trans as ITransaction[]);

      const { data: members } = await supabase.from('cards').select('*').order('created_at', { ascending: false }).limit(5);
      if (members) setRecentMembers(members as ICard[]);
    }
    fetchDashboardData();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Painel de Controle 🪙</h1>
      <p style={styles.subtitle}>Resumo geral do sistema BeitCoin.</p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>MEMBROS ATIVOS</span>
          <span style={styles.statValue}>{stats.totalMembros}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>SALDO EM CIRCULAÇÃO</span>
          <span style={{ ...styles.statValue, color: '#047857' }}>R$ {stats.totalSaldo.toFixed(2)}</span>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Atividade Recente</h2>
          {recentTrans.map((t) => (
            <div key={t.id} style={styles.listItem}>
              <span style={styles.textDarkBold}>{t.user_name}</span>
              <span style={{ fontWeight: '900', color: t.type === 'recharge' ? '#047857' : '#B91C1C' }}>
                {t.type === 'recharge' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
              </span>
            </div>
          ))}
          <Link href="/transacoes" style={styles.link}>Ver todo o histórico →</Link>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Últimos Cartões</h2>
          {recentMembers.map((m) => (
            <div key={m.uid} style={styles.listItem}>
              <span style={styles.textDarkBold}>{m.user_name}</span>
              <span style={styles.textDark}>{m.status === 'active' ? '✅ Ativo' : '🚫 Bloqueado'}</span>
            </div>
          ))}
          <Link href="/membros" style={styles.link}>Gerenciar membros →</Link>
        </section>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#000000', fontSize: '2.2rem', fontWeight: '800', marginBottom: '5px' },
  subtitle: { color: '#1F2937', fontSize: '1.1rem', marginBottom: '40px', fontWeight: '500' },
  statsGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', flex: 1, border: '2px solid #E5E7EB', boxShadow: '0 4px 0px #E5E7EB' },
  statLabel: { color: '#1F2937', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '0.05em' },
  statValue: { fontSize: '2.5rem', fontWeight: '900', color: '#000000', display: 'block', marginTop: '10px' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  section: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #D1D5DB' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px', color: '#000000', borderBottom: '2px solid #000', display: 'inline-block' },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' },
  textDarkBold: { color: '#000000', fontWeight: '700' },
  textDark: { color: '#111827', fontWeight: '500' },
  link: { display: 'block', marginTop: '20px', color: '#000000', textDecoration: 'underline', fontWeight: '800', fontSize: '0.95rem' }
};