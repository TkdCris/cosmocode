"use client";

import React, { Suspense } from "react";
import StarBackground from "@/components/StarBackground";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "@/app/cosmopay.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const qrCode = searchParams.get("qr_code");
  const qrCodeBase64 = searchParams.get("qr_code_base64");
  
  const isPix = status === "pending" && (qrCode || qrCodeBase64);

  const copyToClipboard = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      alert("Código PIX copiado!");
    }
  };

  return (
    <div className="z-10 cosmopay-container text-center max-w-lg w-full">
      <div className="mb-6 flex justify-center">
        <div className={`w-20 h-20 ${isPix ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-green-500/20 border-green-500/50'} rounded-full flex items-center justify-center border`}>
          {isPix ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-2">
        {isPix ? "Aguardando Pagamento" : "Pagamento Recebido!"}
      </h1>
      
      <p className="text-white/60 mb-6">
        {isPix 
          ? "Escaneie o QR Code abaixo ou copie o código para finalizar seu pedido via PIX."
          : "Sua transação foi processada com sucesso. Em breve você receberá um e-mail com os detalhes."}
      </p>

      {isPix && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          {qrCodeBase64 && (
            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <img 
                  src={`data:image/png;base64,${qrCodeBase64}`} 
                  alt="QR Code PIX" 
                  className="w-48 h-48"
                />
              </div>
            </div>
          )}
          
          <div className="text-left mb-6">
            <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-2 block">Código Copia e Cola</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={qrCode || ""} 
                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-xs text-white/80 w-full focus:outline-none"
              />
              <button 
                onClick={copyToClipboard}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] px-4 py-2 rounded-lg transition-colors uppercase"
              >
                Copiar
              </button>
            </div>
          </div>

          {/* Botão de Simulação - Visível apenas em DESENVOLVIMENTO */}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-white/10 pt-4 mt-2">
              <p className="text-[9px] text-white/40 uppercase tracking-tighter mb-2">Ferramenta de Desenvolvedor</p>
              <button 
                onClick={async () => {
                   const paymentId = searchParams.get("payment_id");
                   const res = await fetch("/api/cosmopay/simulate", {
                     method: "POST",
                     body: JSON.stringify({ paymentId })
                   });
                   if (res.ok) {
                     alert("🧪 Sucesso! Pagamento simulado. Recarregue para ver o status (ou aguarde o webhook).");
                     window.location.href = `/checkout/success?status=approved&payment_id=${paymentId}`;
                   }
                }}
                className="w-full py-2 border border-dashed border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 text-[10px] uppercase font-bold rounded-lg transition-all"
              >
                Simular Aprovação de Pagamento
              </button>
            </div>
          )}
        </div>
      )}

      <Link 
        href="/"
        className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/10"
      >
        Voltar para a Home
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <StarBackground />
      </div>

      <Suspense fallback={<div className="text-cyan-400 animate-pulse font-bold tracking-widest">CARREGANDO...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
