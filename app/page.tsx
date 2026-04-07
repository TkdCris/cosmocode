// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter text-red-500 uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
        Cosmo Code
      </h1>
      <p className="mt-4 font-mono text-slate-400 text-center max-w-md">
        Iniciando sistemas... Duarte's Odyssey carregando.
      </p>

      {/* Container de Sprite com efeito glassmorphism */}
      <div className="mt-10 w-32 h-32 bg-slate-900/40 backdrop-blur-sm border-2 border-dashed border-slate-700 flex items-center justify-center rounded-xl">
        <span className="text-xs text-slate-500 font-mono">Sprite Slot</span>
      </div>
    </main>
  );
}

