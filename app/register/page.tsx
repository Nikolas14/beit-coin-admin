'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RegisterTagFormProps {
  onSuccess?: () => void;
}

export default function RegisterTagForm({ onSuccess }: RegisterTagFormProps) {
  const [tagUid, setTagUid] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Inserção na tabela beitcoin_nfc_tags
      // Nota: O trigger 'on_beitcoin_tag_created' no Supabase 
      // criará automaticamente a linha em 'beitcoin_wallets'.
      const { error } = await supabase
        .from('beitcoin_nfc_tags')
        .insert([
          { 
            tag_uid: tagUid.trim().toUpperCase(), 
            alias: alias.trim() 
          }
        ]);

      if (error) {
        // Erro 23505 é Unique Violation (Tag já cadastrada)
        if (error.code === '23505') {
          throw new Error('Esta Tag NFC já está vinculada a outro doador.');
        }
        throw error;
      }

      setMessage({ type: 'success', text: 'Beitcoin Tag cadastrada com sucesso!' });
      
      // Limpa os campos
      setTagUid('');
      setAlias('');

      // Notifica o componente pai para atualizar a lista
      if (onSuccess) {
        onSuccess();
      }

    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Ocorreu um erro ao salvar a tag.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <span className="text-xl text-indigo-600">🏷️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Nova Tag Beitcoin</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tagUid" className="text-sm font-semibold text-gray-700 ml-1">
              UID da Tag (Hexadecimal)
            </label>
            <input
              id="tagUid"
              required
              type="text"
              value={tagUid}
              onChange={(e) => setTagUid(e.target.value)}
              placeholder="Ex: 04:A1:2B:3C"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono uppercase text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="alias" className="text-sm font-semibold text-gray-700 ml-1">
              Identificação do Doador
            </label>
            <input
              id="alias"
              required
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ex: João Silva ou Família X"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex-1">
            {message.text && (
              <div className={`text-sm font-medium animate-in fade-in slide-in-from-left-2 ${
                message.type === 'error' ? 'text-red-500' : 'text-emerald-600'
              }`}>
                {message.type === 'success' ? '✅ ' : '❌ '}
                {message.text}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : (
              'Registrar Tag'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}