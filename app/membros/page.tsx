'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ICard {
  uid: string;
  user_name: string;
  balance: number;
  status: 'active' | 'blocked';
}

export default function MembrosPage() {
  const [cards, setCards] = useState<ICard[]>([]);
  const [newName, setNewName] = useState('');
  const [newUid, setNewUid] = useState('');

  useEffect(() => { fetchCards(); }, []);

  async function fetchCards() {
    const { data } = await supabase.from('cards').select('*').order('user_name');
    if (data) setCards(data as ICard[]);
  }

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('cards').insert([{ uid: newUid, user_name: newName, balance: 0 }]);
    if (!error) { setNewName(''); setNewUid(''); fetchCards(); }
  }

  async function toggleStatus(uid: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    await supabase.from('cards').update({ status: newStatus }).eq('uid', uid);
    fetchCards();
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#000', fontWeight: '900', fontSize: '2rem', marginBottom: '30px' }}>Gestão de Cartões</h1>
      
      <form onSubmit={handleAddCard} style={styles.formCard}>
        <input style={styles.input} placeholder="NOME DO MEMBRO" value={newName} onChange={e => setNewName(e.target.value)} />
        <input style={styles.input} placeholder="ID DA TAG (UID)" value={newUid} onChange={e => setNewUid(e.target.value)} />
        <button style={styles.btnBlack} type="submit">CADASTRAR CARTÃO</button>
      </form>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#000' }}>
              <th style={styles.th}>MEMBRO</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>SALDO ATUAL</th>
              <th style={styles.th}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.uid} style={{ borderBottom: '2px solid #E5E7EB' }}>
                <td style={styles.tdBold}>{card.user_name}</td>
                <td style={styles.td}>{card.status === 'active' ? '🟢 ATIVO' : '🔴 BLOQUEADO'}</td>
                <td style={{ ...styles.tdBold, color: '#047857' }}>R$ {Number(card.balance).toFixed(2)}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => toggleStatus(card.uid, card.status)}
                    style={{ backgroundColor: card.status === 'active' ? '#000' : '#10B981', color: '#FFF', border: 'none', padding: '8px 15px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {card.status === 'active' ? 'BLOQUEAR' : 'ATIVAR'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  formCard: { display: 'flex', gap: '15px', marginBottom: '40px', backgroundColor: '#FFF', padding: '30px', borderRadius: '12px', border: '2px solid #000' },
  input: { flex: 1, padding: '15px', borderRadius: '6px', border: '2px solid #D1D5DB', fontWeight: '700', color: '#000' },
  btnBlack: { backgroundColor: '#000', color: '#FFF', padding: '15px 30px', borderRadius: '6px', border: 'none', fontWeight: '900', cursor: 'pointer' },
  tableWrapper: { backgroundColor: '#FFF', borderRadius: '12px', overflow: 'hidden', border: '2px solid #000' },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { padding: '20px', textAlign: 'left' as const, color: '#FFF', fontWeight: '900', fontSize: '0.8rem' },
  td: { padding: '20px', color: '#111827', fontWeight: '600' },
  tdBold: { padding: '20px', color: '#000', fontWeight: '900' }
};