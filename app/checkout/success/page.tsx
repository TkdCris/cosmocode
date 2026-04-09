import React from "react";
import StarBackground from "@/components/StarBackground";
import Link from "next/link";
import "@/app/cosmopay.css";

export default function SuccessPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <StarBackground />
      </div>

      <div className="z-10 cosmopay-container text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Pagamento Recebido!</h1>
        <p className="text-white/60 mb-8">
          Sua transação foi processada com sucesso. Em breve você receberá um e-mail com os detalhes do seu pedido.
        </p>

        <Link 
          href="/"
          className="inline-block px-8 py-3 bg-[#009ee3] hover:bg-[#007fb1] text-white font-bold rounded-lg transition-all"
        >
          Voltar para a Home
        </Link>
      </div>
    </main>
  );
}
