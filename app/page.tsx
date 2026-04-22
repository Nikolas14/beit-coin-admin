'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { IBeitcoinTag } from '@/interface/interfaces';
import RegisterTagForm from './register/page';
import TopUpModal from './TopUpModal';

export default function BeitcoinDashboard() {
  const [tags, setTags] = useState<IBeitcoinTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<IBeitcoinTag | null>(null);

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('beitcoin_nfc_tags')
      .select(`
        *,
        beitcoin_wallets ( id, balance )
      `);

    if (!error) setTags(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-indigo-900">Beitcoin Control Panel 🪙</h1>

      {/* Área de Cadastro */}
      <section className="mb-10">
        <RegisterTagForm onSuccess={loadData} />
      </section>

      {/* Tabela de Gestão */}
      <section className="bg-white rounded-xl shadow-md border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Doador / Alias</th>
              <th className="p-4 font-semibold text-gray-600">UID da Tag</th>
              <th className="p-4 font-semibold text-gray-600">Saldo Atual</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tags.map(tag => (
              <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{tag.alias}</td>
                <td className="p-4 font-mono text-sm text-gray-500">{tag.tag_uid}</td>
                <td className="p-4 font-bold text-green-600">
                  R$ {tag.beitcoin_wallets?.[0]?.balance.toFixed(2) || '0.00'}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedTag(tag)}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 text-sm font-semibold"
                  >
                    Recarregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <div className="p-10 text-center text-gray-400">Carregando dados...</div>}
      </section>
      {selectedTag && (
        <TopUpModal
          tag={{ id: selectedTag.id, alias: selectedTag.alias || '' }}
          onClose={() => setSelectedTag(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}