"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import StarBackground from "@/components/StarBackground";
import OrderSummary from "@/components/cosmopay/OrderSummary";

const CosmosWalletButton = dynamic(
  () => import("@/components/cosmopay/CosmosWalletButton"),
  { ssr: false }
);

import "@/app/cosmopay.css";

const PRESET_VALUES = [50, 100, 200, 500];

export default function CheckoutPage() {
  const [amount, setAmount] = useState<number>(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [description, setDescription] = useState("Pagamento Personalizado");

  const items = amount > 0 ? [
    {
      title: description,
      quantity: 1,
      unit_price: amount,
    }
  ] : [];

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não é dígito
    const cleanValue = e.target.value.replace(/\D/g, "");
    
    // Converte para centavos e depois para reais
    const cents = parseInt(cleanValue || "0", 10);
    const floatValue = cents / 100;
    
    setAmount(floatValue);
  };

  const getDisplayAmount = (val: number) => {
    if (val === 0) return "";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <StarBackground />
      </div>

      <div className="z-10 cosmopay-container">
        <div className="flex justify-center mb-6">
          <div className="text-2xl font-black tracking-tighter text-white">
            COSMO<span className="text-[#009ee3]">PAY</span>
          </div>
        </div>

        {!isConfirmed ? (
          <div className="cosmopay-value-selection">
            <h2 className="cosmopay-title text-center">Quanto deseja pagar?</h2>
            
            <div className="cosmopay-presets-grid">
              {PRESET_VALUES.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`preset-button ${amount === val ? 'active' : ''}`}
                >
                  R$ {val}
                </button>
              ))}
            </div>

            <div className="custom-value-wrapper">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Ou insira um valor manual</label>
              <span className="currency-symbol">R$</span>
              <input
                type="text"
                placeholder="0,00"
                className="custom-value-input"
                value={getDisplayAmount(amount)}
                onChange={handleManualChange}
              />
            </div>

            <div className="custom-value-wrapper">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Descrição (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Consultoria Técnica"
                className="custom-value-input"
                style={{ fontSize: '14px', paddingLeft: '16px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              disabled={amount <= 0}
              onClick={() => setIsConfirmed(true)}
              className="confirm-button"
            >
              Gerar Pagamento
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="payment-stage-summary">
              <div>
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Valor do Pagamento</p>
                <div className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(amount)}
                </div>
              </div>
              <button onClick={() => setIsConfirmed(false)} className="edit-value-btn">
                Alterar
              </button>
            </div>

            <OrderSummary items={items} total={amount} />

            <CosmosWalletButton tenantId="COSMOCODE" items={items} />
          </div>
        )}

        <p className="text-center text-[10px] text-white/40 mt-4">
          Ambiente de pagamento seguro processado pelo Mercado Pago.<br />
          Ao continuar você concorda com os termos de serviço.
        </p>
      </div>
    </main>
  );
}
