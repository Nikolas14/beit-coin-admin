'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Admin.module.css';
import TopUpModal from '../TopUpModal';
import RegisterTagForm from '@/components/RegisterTagForm/RegisterTagForm';

export default function AdminDashboard() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<any>(null);

  // Carrega os dados das tags e carteiras
  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('beitcoin_nfc_tags')
      .select(`
        *,
        beitcoin_wallets ( id, balance )
      `)
      .order('created_at', { ascending: false });

    if (!error) setTags(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Cálculos de resumo
  const totalBalance = tags.reduce((acc, tag) => acc + (tag.beitcoin_wallets?.[0]?.balance || 0), 0);
  const activeTags = tags.length;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="text-3xl font-black text-indigo-900">Gestão Beitcoin</h1>
          <p className="text-gray-500">Controle de doadores e recargas</p>
        </div>
        <button onClick={loadData} className="p-2 text-indigo-600 hover:rotate-180 transition-transform duration-500">
          🔄
        </button>
      </header>

      {/* Cartões de Resumo */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Saldo Total no Sistema</p>
          <p className={styles.statValue}>
            {totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Tags Ativas</p>
          <p className={styles.statValue}>{activeTags}</p>
        </div>
      </section>

      {/* Formulário de Cadastro */}
      <section className="mb-10">
        <RegisterTagForm onSuccess={loadData} />
      </section>

      {/* Tabela de Tags */}
      <section className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Doador / Tag</th>
              <th>Saldo Atual</th>
              <th className="text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td>
                  <div className={styles.donorInfo}>
                    <span className={styles.donorName}>{tag.alias || 'Sem Nome'}</span>
                    <span className={styles.tagUid}>{tag.tag_uid}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.balance}>
                    {tag.beitcoin_wallets?.[0]?.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
                  </span>
                </td>
                <td className="text-right">
                  <button 
                    className={styles.rechargeBtn}
                    onClick={() => setSelectedTag(tag)}
                  >
                    Recarregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-10 text-center text-gray-400">Carregando...</p>}
        {!loading && tags.length === 0 && <p className="p-10 text-center text-gray-400">Nenhuma tag encontrada.</p>}
      </section>

      {/* Modal de Recarga */}
      {selectedTag && (
        <TopUpModal 
          tag={{ id: selectedTag.id, alias: selectedTag.alias }}
          onClose={() => setSelectedTag(null)}
          onSuccess={loadData}
        />
      )}
    </main>
  );
}