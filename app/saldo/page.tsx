'use client';

import { useEffect, useRef } from 'react';
import { useBeitcoinBalance } from '@/hooks/useBeitcoinBalance';
import styles from './Balance.module.css';

export default function CheckBalance() {
    // Hook customizado que criamos para gerenciar a lógica de saldo e histórico
    const { checkBalance, result, loading, error, clear } = useBeitcoinBalance();

    // Referência para o input invisível que captura o leitor NFC (simulando teclado)
    const inputRef = useRef<HTMLInputElement>(null);

    // Foco automático no input sempre que a página carrega ou o resultado é limpo
    useEffect(() => {
        const focusInput = () => inputRef.current?.focus();
        focusInput();

        // Garante o foco se o usuário clicar em qualquer lugar da tela
        window.addEventListener('click', focusInput);
        return () => window.removeEventListener('click', focusInput);
    }, [result, error]);

    // Função para processar a leitura da tag
    const handleTagRead = (uid: string) => {
        if (!uid) return;
        checkBalance(uid);

        // Timer de limpeza: após 8 segundos, a tela volta ao estado inicial
        // Isso evita que o saldo de um doador fique exposto para o próximo da fila
        setTimeout(() => {
            clear();
        }, 8000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className="mb-6">
                    <h1 className={styles.title}>Consulta Beitcoin 🪙</h1>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                        Sistema de Tzedaká
                    </p>
                </header>

                {/* ESTADO: CARREGANDO */}
                {loading && (
                    <div className="py-12 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className={styles.pulse}>Buscando informações...</p>
                    </div>
                )}

                {/* ESTADO: AGUARDANDO LEITURA */}
                {!loading && !result && !error && (
                    <div className={`${styles.waitingBox} animate-in fade-in duration-500`}>
                        <div className="text-6xl mb-4">📳</div>
                        <h2 className="text-xl font-bold text-gray-700">Aproxime sua Tag</h2>
                        <p className="text-gray-400 text-sm mt-2">
                            Posicione a tag no leitor para<br />verificar seu saldo e histórico.
                        </p>
                    </div>
                )}

                {/* ESTADO: EXIBINDO SALDO E HISTÓRICO */}
                {result && !loading && (
                    <div className="animate-in zoom-in fade-in duration-500">
                        <div className="mb-8">
                            <p className={styles.balanceLabel}>Saldo Disponível</p>
                            <h2 className={styles.amount}>
                                {result.balance.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </h2>
                            <p className={styles.donorName}>
                                Shalom, <strong>{result.alias}</strong>!
                            </p>
                        </div>

                        {/* SEÇÃO DE HISTÓRICO RECENTE */}
                        <div className={styles.historySection}>
                            <h3 className={styles.historyTitle}>Últimas 3 atividades</h3>

                            {result.recentTransactions.length > 0 ? (
                                <div className="space-y-1">
                                    {result.recentTransactions.map((tx, i) => (
                                        <div key={i} className={styles.transactionRow}>
                                            <span className={styles.transactionDate}>
                                                {new Date(tx.created_at).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            <span className={`
                        ${styles.transactionValue} 
                        ${tx.amount > 0 ? styles.positive : styles.negative}
                      `}>
                                                {tx.amount > 0 ? `+` : ``}
                                                {tx.amount.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-xs italic py-2 text-center">
                                    Nenhuma transação encontrada.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ESTADO: ERRO */}
                {error && !loading && (
                    <div className="py-8 animate-in shake-in">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-red-600 font-bold text-lg">Ops! Algo deu errado</h2>
                        <p className="text-gray-500 text-sm mt-1">{error}</p>
                        <button
                            onClick={clear}
                            className="mt-6 text-indigo-600 font-bold text-sm underline"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* INPUT INVISÍVEL: O segredo para o funcionamento com leitores USB */}
                <input
                    ref={inputRef}
                    type="text"
                    className="opacity-0 absolute h-0 w-0"
                    autoFocus
                    inputMode="none" // <-- ISSO evita que o teclado do Android suba
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleTagRead((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                        }
                    }}
                />
            </div>

            <footer className="mt-10 text-center">
                <p className="text-indigo-400/60 text-sm italic font-medium">
                    "A Tzedaká é igual a todos os outros mandamentos juntos."
                </p>
            </footer>
        </div>
    );
}