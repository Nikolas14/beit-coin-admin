'use client';

import { useState, useEffect, useRef } from 'react';
import { useBeitcoinDonation } from '@/hooks/useBeitcoinDonation';
import styles from './Terminal.module.css';
import BeitcoinKeypad from '@/components/BeitcoinKeypad/BeitcoinKeypad';

export default function DonationTerminal() {
  // Estados de Interface
  const [rawValue, setRawValue] = useState(''); // Centavos em string: "1500" = R$ 15,00
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'reading'>('idle');
  const [donorName, setDonorName] = useState('');
  
  // Hook de Lógica de Negócio
  const { donate, loading, error, success, resetStatus } = useBeitcoinDonation();
  
  // Referência para o input invisível (Leitor NFC USB)
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Formatação de Moeda
  const formatCurrency = (value: string) => {
    const num = parseInt(value || '0') / 100;
    return num.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  // Funções do Teclado
  const handleKeyPress = (key: string) => {
    if (terminalStatus !== 'idle') return;
    if (rawValue.length >= 8) return; // Limite de R$ 999.999,99
    setRawValue(prev => prev + key);
  };

  const handleClear = () => setRawValue('');
  const handleDelete = () => setRawValue(prev => prev.slice(0, -1));

  // Iniciar Leitura da Tag
  const startReading = () => {
    if (parseInt(rawValue) <= 0) return;
    setTerminalStatus('reading');
    // Foco no input invisível após um pequeno delay
    setTimeout(() => tagInputRef.current?.focus(), 100);
  };

  // Processar a Doação (Chamado pelo Input NFC)
  const handleTagRead = async (tagUid: string) => {
    const amount = parseInt(rawValue) / 100;
    const result = await donate(tagUid, amount);

    if (result.success) {
      setDonorName(result.donor || 'Doador');
      // Limpa e volta ao início após 3.5 segundos de sucesso
      setTimeout(() => {
        setRawValue('');
        setTerminalStatus('idle');
        resetStatus();
      }, 3500);
    } else {
      // Se der erro (ex: saldo insuficiente), volta para o modo leitura para tentar outra tag
      setTimeout(() => {
        setTerminalStatus('reading');
        tagInputRef.current?.focus();
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header com o Valor */}
        <div className={styles.displayHeader}>
          <p className={styles.displayLabel}>Valor da Tzedaká</p>
          <h1 className={styles.displayAmount}>
            {formatCurrency(rawValue)}
          </h1>
        </div>

        <div className={styles.content}>
          
          {/* ESTADO 1: Digitação do Valor */}
          {terminalStatus === 'idle' && (
            <div className="animate-in fade-in duration-300">
              <BeitcoinKeypad 
                onKeyPress={handleKeyPress}
                onClear={handleClear}
                onDelete={handleDelete}
              />
              <button 
                className={styles.actionButton}
                onClick={startReading}
                disabled={!rawValue || parseInt(rawValue) === 0}
              >
                Cobrar Doação
              </button>
            </div>
          )}

          {/* ESTADO 2: Aguardando Tag ou Processando */}
          {(terminalStatus === 'reading' || loading) && !success && !error && (
            <div className={`${styles.statusScreen} ${loading ? '' : styles.pulse}`}>
              <div className={styles.icon}>{loading ? '⏳' : '📳'}</div>
              <h2 className="text-2xl font-bold text-indigo-900">
                {loading ? 'Processando...' : 'Aproxime a Tag'}
              </h2>
              <p className="text-gray-500 mt-2">
                {loading ? 'Validando Beitcoins no banco...' : 'Aguardando sinal NFC'}
              </p>
              {/* Input Invisível para capturar o UID do leitor USB */}
              <input 
                ref={tagInputRef}
                type="text"
                className="opacity-0 absolute"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTagRead((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
          )}

          {/* ESTADO 3: Sucesso */}
          {success && (
            <div className={`${styles.statusScreen} animate-in zoom-in duration-300`}>
              <div className={`${styles.icon} ${styles.bounce}`}>✅</div>
              <h2 className="text-emerald-600 text-3xl font-black">Sucesso!</h2>
              <p className="text-gray-600 mt-2 text-lg">
                Tzedaká de <strong>{formatCurrency(rawValue)}</strong> realizada.
              </p>
              <p className="text-indigo-900 font-bold mt-1 italic">Tizku l'mitzvot, {donorName}!</p>
            </div>
          )}

          {/* ESTADO 4: Erro (Saldo insuficiente, tag inválida, etc) */}
          {error && !loading && (
            <div className={`${styles.statusScreen} animate-in shake-in`}>
              <div className={styles.icon}>❌</div>
              <h2 className="text-red-600 text-2xl font-bold">Falhou</h2>
              <p className="text-gray-700 mt-2 font-medium">{error}</p>
              <button 
                onClick={() => { resetStatus(); setTerminalStatus('idle'); }}
                className="mt-6 text-indigo-600 font-bold underline"
              >
                Tentar outro valor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé informativo */}
      <p className="mt-8 text-gray-400 text-sm font-medium">
        Beitcoin Terminal v1.0 • Belém/PA
      </p>
    </div>
  );
}