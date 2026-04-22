'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TopUpModalProps {
  tag: { id: string; alias: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function TopUpModal({ tag, onClose, onSuccess }: TopUpModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert("Insira um valor válido.");
      return;
    }

    setLoading(true);

    // Chamada à RPC que criámos no SQL
    const { error } = await supabase.rpc('recharge_beitcoin_wallet', {
      p_tag_id: tag.id,
      p_amount: value,
      p_description: `Recarga para ${tag.alias}`
    });

    if (error) {
      alert("Erro na recarga: " + error.message);
    } else {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-1">Recarregar Beitcoin</h2>
        <p className="text-gray-500 text-sm mb-6">Doador: <span className="font-semibold text-gray-700">{tag.alias}</span></p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Recarga (R$)</label>
            <input
              autoFocus
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleRecharge}
              disabled={loading || !amount}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'A processar...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}