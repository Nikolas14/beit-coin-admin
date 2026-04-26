'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './RegisterTagForm.module.css';

interface RegisterTagFormProps {
  onSuccess?: () => void;
}

export default function RegisterTagForm({ onSuccess }: RegisterTagFormProps) {
  const [tagUid, setTagUid] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase
        .from('beitcoin_nfc_tags')
        .insert([
          { 
            tag_uid: tagUid.trim().toUpperCase(), 
            alias: alias.trim() 
          }
        ]);

      if (error) {
        if (error.code === '23505') throw new Error('Esta Tag já está cadastrada.');
        throw error;
      }

      setMsg({ type: 'success', text: 'Doador cadastrado com sucesso!' });
      setTagUid('');
      setAlias('');
      
      // Atualiza a lista no AdminDashboard
      onSuccess?.();

      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => setMsg(null), 3000);

    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Erro ao cadastrar.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <span>✨</span> Novo Doador Beitcoin
      </h2>
      
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>UID da Tag NFC</label>
          <input
            required
            className={styles.input}
            placeholder="Ex: 04:A1:2B:3C"
            value={tagUid}
            onChange={(e) => setTagUid(e.target.value)}
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Nome do Doador / Família</label>
          <input
            required
            className={styles.input}
            placeholder="Ex: Abraham Levy"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={loading || !tagUid || !alias}
        >
          {loading ? 'Salvando...' : 'Cadastrar Tag'}
        </button>
      </form>

      {msg && (
        <div className={`${styles.message} ${msg.type === 'success' ? styles.success : styles.error}`}>
          {msg.type === 'success' ? '✅ ' : '❌ '} {msg.text}
        </div>
      )}
    </div>
  );
}