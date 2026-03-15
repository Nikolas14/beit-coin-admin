'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Interface para garantir textos tipados e evitar erro de 'never[]'
interface ITransaction {
  id: string;
  user_name: string;
  amount: number;
  type: 'recharge' | 'debit';
  created_at: string;
}

export default function TransacoesPage() {
  const [trans, setTrans] = useState<ITransaction[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransacoes();
  }, [filtro]);

  async function fetchTransacoes() {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplica o filtro se o utilizador digitar algo
    if (filtro) {
      query = query.ilike('user_name', `%${filtro}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setTrans(data as ITransaction[]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Histórico de Transações</h1>
      <p style={styles.subtitle}>Consulte todos os débitos e recargas realizados no sistema.</p>

      {/* Barra de Pesquisa */}
      <div style={styles.searchSection}>
        <input 
          style={styles.searchInput}
          placeholder="🔍 PESQUISAR POR NOME DO MEMBRO..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* Tabela de Transações */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>DATA E HORA</th>
              <th style={styles.th}>MEMBRO</th>
              <th style={styles.th}>OPERAÇÃO</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>VALOR</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={styles.loadingCell}>A carregar registos...</td>
              </tr>
            ) : trans.length === 0 ? (
              <tr>
                <td colSpan={4} style={styles.loadingCell}>Nenhuma transação encontrada.</td>
              </tr>
            ) : (
              trans.map((t) => (
                <tr key={t.id} style={styles.tr}>
                  <td style={styles.tdDate}>
                    {new Date(t.created_at).toLocaleString('pt-BR')}
                  </td>
                  <td style={styles.tdMember}>{t.user_name}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: t.type === 'recharge' ? '#D1FAE5' : '#FEE2E2',
                      color: t.type === 'recharge' ? '#047857' : '#B91C1C'
                    }}>
                      {t.type === 'recharge' ? 'RECARGA' : 'DÉBITO'}
                    </span>
                  </td>
                  <td style={{
                    ...styles.tdAmount,
                    color: t.type === 'recharge' ? '#047857' : '#B91C1C'
                  }}>
                    {t.type === 'recharge' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#000000', fontSize: '2.2rem', fontWeight: '900', marginBottom: '5px' },
  subtitle: { color: '#1F2937', fontSize: '1.1rem', marginBottom: '30px', fontWeight: '600' },
  searchSection: { marginBottom: '30px' },
  searchInput: {
    width: '100%',
    padding: '18px',
    borderRadius: '12px',
    border: '2px solid #000',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#000',
    outline: 'none',
    boxShadow: '0 4px 0px #000'
  },
  tableWrapper: {
    backgroundColor: '#FFF',
    borderRadius: '12px',
    border: '2px solid #000',
    overflow: 'hidden',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { backgroundColor: '#000' },
  th: {
    padding: '20px',
    textAlign: 'left',
    color: '#FFF',
    fontWeight: '900',
    fontSize: '0.85rem',
    letterSpacing: '0.05em'
  },
  tr: { borderBottom: '2px solid #F3F4F6' },
  td: { padding: '20px' },
  tdDate: { padding: '20px', color: '#4B5563', fontWeight: '600', fontSize: '0.9rem' },
  tdMember: { padding: '20px', color: '#000', fontWeight: '900', fontSize: '1rem' },
  tdAmount: { padding: '20px', textAlign: 'right', fontWeight: '900', fontSize: '1.1rem' },
  badge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '900'
  },
  loadingCell: { padding: '40px', textAlign: 'center', color: '#000', fontWeight: '700' }
};