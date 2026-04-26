import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface DonationResult {
  success: boolean;
  message: string;
  newBalance?: number;
  donor?: string;
}

export function useBeitcoinDonation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const donate = useCallback(async (tagUid: string, amount: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Resolve o UID para o ID interno da tag
      const { data: tagData, error: tagError } = await supabase
        .from('beitcoin_nfc_tags')
        .select('id, alias')
        .eq('tag_uid', tagUid.toUpperCase().trim())
        .single();

      if (tagError || !tagData) {
        throw new Error('Tag não reconhecida no sistema.');
      }

      // 2. Chama a RPC de débito
      const { data, error: rpcError } = await supabase.rpc('debit_beitcoin_wallet', {
        p_tag_id: tagData.id,
        p_amount: amount,
        p_description: `Doação via Terminal - ${tagData.alias}`
      });

      if (rpcError) throw rpcError;

      // A RPC retorna o objeto JSON que definimos no Postgres
      if (!data.success) {
        throw new Error(data.message);
      }

      setSuccess(true);
      return { success: true, message: data.message, donor: tagData.alias };

    } catch (err: any) {
      const msg = err.message || 'Erro inesperado ao processar doação.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetStatus = () => {
    setSuccess(false);
    setError(null);
    setLoading(false);
  };

  return { donate, loading, error, success, resetStatus };
}