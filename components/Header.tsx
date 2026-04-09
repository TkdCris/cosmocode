// components/Header.tsx
import Link from 'next/link';

/**
 * Componente de Header com estilo retro-futurista (Cyberpunk/Glitch).
 * Utiliza o Tailwind CSS v4 para estilização.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-cyan-500/50 bg-slate-950/80 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between font-mono">
        {/* Logo / Título do Site */}
        <div className="relative group">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-cyan-400 uppercase select-none">
            Cosmo<span className="text-magenta-500 animate-pulse">Code</span>
            <div className="absolute -inset-1 bg-cyan-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Navegação */}
        <nav className="flex items-center gap-8">
          <Link 
            href="/software" 
            className="text-slate-400 hover:text-cyan-400 hover:tracking-[0.1em] transition-all duration-300 text-sm uppercase font-semibold border-b-2 border-transparent hover:border-cyan-400"
          >
            Software
          </Link>
          <Link 
            href="/games" 
            className="text-slate-400 hover:text-yellow-400 hover:tracking-[0.1em] transition-all duration-300 text-sm uppercase font-semibold border-b-2 border-transparent hover:border-yellow-400"
          >
            Games
          </Link>
          <Link 
            href="/devlog" 
            className="text-slate-400 hover:text-magenta-400 hover:tracking-[0.1em] transition-all duration-300 text-sm uppercase font-semibold border-b-2 border-transparent hover:border-magenta-400"
          >
            DevLog
          </Link>

          {/* Botão Cosmopay Checkout */}
          <Link 
            href="/checkout" 
            className="ml-4 px-4 py-1.5 bg-cyan-500 text-slate-950 text-xs font-bold uppercase rounded hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 flex items-center gap-2 group"
          >
            <span className="group-hover:translate-x-0.5 transition-transform">CosmoPay</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </nav>

        {/* Status indicator (Retro detail) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 text-[10px] text-emerald-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
          SYSTEM: ONLINE
        </div>
      </div>
    </header>
  );
}
