import React from "react";
import StarBackground from "@/components/StarBackground";
import Link from "next/link";
import "@/app/cosmopay.css";

export default function FailurePage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <StarBackground />
      </div>

      <div className="z-10 cosmopay-container text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Ops! Algo deu errado.</h1>
        <p className="text-white/60 mb-8">
          Não conseguimos processar seu pagamento neste momento. Por favor, verifique seus dados ou tente outro método de pagamento.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            href="/checkout"
            className="inline-block px-8 py-3 bg-[#009ee3] hover:bg-[#007fb1] text-white font-bold rounded-lg transition-all"
          >
            Tentar Novamente
          </Link>
          
          <Link 
            href="/"
            className="text-white/40 hover:text-white/60 transition-all text-sm"
          >
            Voltar para o site
          </Link>
        </div>
      </div>
    </main>
  );
}
