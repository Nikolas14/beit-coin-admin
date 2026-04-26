import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Transaction {
  amount: number;
  created_at: string;
  type: 'topup' | 'donation';
}

interface BalanceResult {
  alias: string;
  balance: number;
  recentTransactions: Transaction[];
}

export function useBeitcoinBalance() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkBalance = async (tagUid: string) => {
    setLoading(true);
    setError(null);

    try {
      // Buscamos a tag, a wallet e as 3 últimas transações (ordenadas por data)
      const { data, error: queryError } = await supabase
        .from('beitcoin_nfc_tags')
        .select(`
          alias,
          beitcoin_wallets (
            balance,
            beitcoin_transactions (
              amount,
              created_at,
              type
            )
          )
        `)
        .eq('tag_uid', tagUid.toUpperCase().trim())
        .order('created_at', { foreignTable: 'beitcoin_wallets.beitcoin_transactions', ascending: false })
        .limit(3, { foreignTable: 'beitcoin_wallets.beitcoin_transactions' })
        .single();

      if (queryError || !data) throw new Error('Tag não encontrada.');

      const wallet = data.beitcoin_wallets?.[0];
      
      setResult({
        alias: data.alias,
        balance: wallet?.balance || 0,
        recentTransactions: wallet?.beitcoin_transactions || []
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { checkBalance, result, loading, error, clear: () => setResult(null) };
}