"use client";

import React, { useState, useEffect, useRef } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// Log para confirmar que o browser baixou o arquivo
console.log("[CosmoPay] 🚀 SDK Bridge carregada.");

interface CosmosWalletButtonProps {
  tenantId: string;
  items: any[];
}

export default function CosmosWalletButton({ tenantId, items = [] }: CosmosWalletButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedRef = useRef(false);

  const totalAmount = (items || []).reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);

  // Efeito principal de carregamento
  useEffect(() => {
    let isMounted = true;
    
    const prepare = async () => {
      console.log("[CosmoPay] 🔄 Iniciando preparação do checkout...");
      try {
        const response = await fetch("/api/cosmopay/checkout", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true" 
          },
          body: JSON.stringify({ tenantId, items }),
        });

        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const data = await response.json();
        
        console.log("[CosmoPay] 🛰️ Resposta da API recebida!");

        if (!isMounted) return;

        const { publicKey, preferenceId: prefId, transactionId: transId } = data;

        if (publicKey && prefId) {
          console.log("[CosmoPay] 🔑 Inicializando SDK e liberando UI...");
          initMercadoPago(publicKey, { 
            locale: 'pt-BR',
            advancedFraudPrevention: false,
            trackingDisabled: true
          });
          
          setPreferenceId(prefId);
          setTransactionId(transId);
          setIsSdkReady(true);
          setIsLoading(false);
          console.log("[CosmoPay] ✅ Checkout Pronto!");
        } else {
          console.error("[CosmoPay] ❌ Dados insuficientes:", data);
          setError("Dados de pagamento inválidos.");
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("[CosmoPay] ❌ Falha crítica no prepare:", err);
        setError("Erro ao preparar checkout.");
        setIsLoading(false);
      }
    };

    prepare();
    return () => { isMounted = false; };
  }, [tenantId]);

  const onSubmit = async ({ formData }: any) => {
    console.log("[CosmoPay] 💳 Submetendo pagamento...");
    try {
      const response = await fetch("/api/cosmopay/process", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify({
          ...formData,
          tenantId,
          transactionId,
          items,
        }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      // Verificamos aprovado, em processo ou pendente (PIX)
      const isSuccess = ["approved", "in_process", "pending"].includes(result.status);

      if (isSuccess) {
        let targetUrl = `${window.location.origin}/checkout/success?payment_id=${result.paymentId || result.payment_id}&status=${result.status}`;
        
        // Se for PIX, anexamos os dados do QR Code para exibição
        if (result.point_of_interaction?.transaction_data) {
          const { qr_code, qr_code_base64 } = result.point_of_interaction.transaction_data;
          if (qr_code) targetUrl += `&qr_code=${encodeURIComponent(qr_code)}`;
          if (qr_code_base64) targetUrl += `&qr_code_base64=${encodeURIComponent(qr_code_base64)}`;
        }

        console.log("[CosmoPay] ✅ Redirecionando para:", targetUrl);
        window.location.href = targetUrl;
      } else {
        alert(`Estado do pagamento: ${result.status_detail || result.status}`);
      }
    } catch (err: any) {
      console.error("[CosmoPay] ❌ Erro no Submit:", err);
      alert(err.message || "Erro ao processar pgt.");
    }
  };

  if (isLoading || !isSdkReady) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-white/10 animate-pulse">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase">Estabelecendo Conexão Segura...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl">
        <h4 className="text-red-500 font-bold uppercase text-xs mb-2">⚠️ Falha no Checkout</h4>
        <p className="text-red-400 text-xs">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-[10px] uppercase font-bold text-white bg-red-500 px-4 py-2 rounded">Tentar de Novo</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[500px]" id="paymentBrick_container">
      <Payment
        initialization={{
          amount: totalAmount,
          preferenceId: preferenceId!,
        }}
        customization={{
          visual: {
            style: {
              theme: 'dark',
            },
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            bankTransfer: 'all',
            mercadoPago: 'all',
          },
        }}
        onSubmit={onSubmit}
        onReady={() => console.log("[CosmoPay] 🎯 Payment Brick Renderizado!")}
        onError={(err) => console.error("[CosmoPay] ⚠️ Erro no Brick:", err)}
      />
    </div>
  );
}