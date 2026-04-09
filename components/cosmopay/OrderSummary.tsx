import React from "react";

interface Item {
  title: string;
  quantity: number;
  unit_price: number;
}

interface OrderSummaryProps {
  items: Item[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  return (
    <div className="cosmopay-summary-list">
      <h2 className="cosmopay-title">Resumo do Pedido</h2>
      
      {items.map((item, index) => (
        <div key={index} className="cosmopay-item">
          <div className="cosmopay-item-info">
            <span className="cosmopay-item-name">{item.title}</span>
            <span className="cosmopay-item-qty">{item.quantity}x</span>
          </div>
          <span className="cosmopay-item-price">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.unit_price)}
          </span>
        </div>
      ))}

      <div className="cosmopay-total-row" style={{ marginTop: "24px" }}>
        <span>Total a pagar</span>
        <span className="cosmopay-total-price">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(total)}
        </span>
      </div>

      <div className="cosmopay-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0110 0v4"></path>
        </svg>
        Pagamento Processado com Segurança
      </div>
    </div>
  );
};

export default OrderSummary;
