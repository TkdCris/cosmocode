"use client";

import React from "react";
import dynamic from "next/dynamic";
import StarBackground from "@/components/StarBackground";
import OrderSummary from "@/components/cosmopay/OrderSummary";

// Importação dinâmica com SSR desativado para evitar erros de hidratação com o Brick do Mercado Pago
const CosmosWalletButton = dynamic(
  () => import("@/components/cosmopay/CosmosWalletButton"),
  { ssr: false }
);

import "@/app/cosmopay.css";

// Dados de exemplo do pedido (Em um sistema real, isso viria de um carrinho/DB)
const MOCK_ITEMS = [
  {
    title: "Desenvolvimento Site One Page",
    quantity: 1,
    unit_price: 1200.00,
  },
  {
    title: "Hospedagem Premium - Anual",
    quantity: 1,
    unit_price: 350.00,
  }
];

export default function CheckoutPage() {
  const total = MOCK_ITEMS.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      {/* Fundo de Estrelas conforme o design do Cosmocode */}
      <div className="fixed inset-0 z-0">
        <StarBackground />
      </div>

      {/* Container de Checkout */}
      <div className="z-10 cosmopay-container">
        <div className="flex justify-center mb-6">
          {/* LOGO Placeholder - Você pode trocar pelo seu SVG de Logo */}
          <div className="text-2xl font-black tracking-tighter text-white">
            COSMO<span className="text-[#009ee3]">PAY</span>
          </div>
        </div>

        {/* Resumo Visual dos Itens */}
        <OrderSummary items={MOCK_ITEMS} total={total} />

        {/* Botão de Pagamento Multi-Tenant */}
        <CosmosWalletButton tenantId="COSMOCODE" items={MOCK_ITEMS} />

        <p className="text-center text-[10px] text-white/40 mt-4">
          Ambiente de pagamento seguro processado pelo Mercado Pago.<br />
          Ao continuar você concorda com os termos de serviço.
        </p>
      </div>
    </main>
  );
}
