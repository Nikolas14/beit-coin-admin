'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tag, ShoppingCart, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // Se estiver na Home, talvez não queira mostrar a barra, mas vamos deixar para facilitar
  const navItems = [
    { name: 'Home', href: '/', icon: <Home size={20} /> },
    { name: 'Gestão', href: '/admin', icon: <Tag size={20} /> },
    { name: 'Terminal', href: '/terminal', icon: <ShoppingCart size={20} /> },
    { name: 'Saldo', href: '/saldo', icon: <Search size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-md mx-auto flex justify-between items-center md:max-w-5xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}