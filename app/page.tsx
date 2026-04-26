import Link from 'next/link';

export default function BeitcoinHub() {
  const cards = [
    { title: 'Terminal de Doação', desc: 'Realizar cobranças (Maquininha)', href: '/terminal', icon: '💰', color: 'bg-emerald-500' },
    { title: 'Consulta de Saldo', desc: 'Verificar saldo do doador', href: '/saldo', icon: '🔍', color: 'bg-blue-500' },
    { title: 'Painel de Gestão', desc: 'Cadastrar tags e recarregar', href: '/admin', icon: '⚙️', color: 'bg-indigo-600' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6 pb-24">
      <header className="text-center py-10">
        <h1 className="text-4xl font-black text-indigo-900 mb-2">Beitcoin 🪙</h1>
        <p className="text-gray-500 font-medium">Selecione o modo de operação</p>
      </header>

      <div className="max-w-md mx-auto grid gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 active:scale-95 transition-transform hover:shadow-md">
              <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner`}>
                {card.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{card.title}</h2>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
              <span className="text-gray-300 text-2xl font-light">→</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-12 text-center text-gray-400 text-xs">
        Belém, PA • {new Date().getFullYear()}
      </footer>
    </main>
  );
}