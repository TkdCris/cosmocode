import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { getMercadoPagoClient } from "@/lib/cosmopay/mercadopago";
import prisma from "@/lib/prisma";

/**
 * Rota para processar o pagamento do Checkout Transparente (Payment Brick).
 * Recebe o token do cartão e os dados do pagador e cria a cobrança no Mercado Pago.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extraímos os dados enviados pelo Brick e também nossos identificadores internos
    const { 
      token, 
      issuer_id, 
      payment_method_id, 
      transaction_amount, 
      installments, 
      payer, 
      tenantId, 
      transactionId 
    } = body;

    if (!tenantId || !transactionId) {
      return NextResponse.json({ error: "Dados de identificação (tenant/transaction) ausentes." }, { status: 400 });
    }

    // 1. Inicializar Cliente MP do Tenant
    const client = getMercadoPagoClient(tenantId);
    const payment = new Payment(client);

    // 2. Criar o Pagamento no Mercado Pago
    // Nota: O payload segue a estrutura da API de Payments v1 do Mercado Pago
    const paymentResponse = await payment.create({
      body: {
        token,
        issuer_id,
        payment_method_id,
        transaction_amount,
        installments,
        description: `Pagamento CosmoPay - Transação ${transactionId}`,
        payer: {
          email: payer.email,
          identification: payer.identification,
        },
        external_reference: transactionId, // Link com nosso banco de dados
        // Podemos adicionar o notification_url aqui também se quisermos redundância
      },
    });

    console.log(`[CosmoPay] Pagamento processado para ${transactionId}:`, paymentResponse.status);

    // 3. Atualizar o status da transação no nosso Banco de Dados
    // O status do Mercado Pago pode ser: approved, pending, in_process, rejected, etc.
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentId: String(paymentResponse.id),
        status: paymentResponse.status || "pending",
        metadata: {
          status_detail: paymentResponse.status_detail,
          payment_method: payment_method_id,
        }
      },
    });

    // 4. Retornar o resultado para o frontend, incluindo dados de PIX se existirem
    return NextResponse.json({
      status: paymentResponse.status,
      status_detail: paymentResponse.status_detail,
      paymentId: paymentResponse.id,
      point_of_interaction: paymentResponse.point_of_interaction,
    });

  } catch (error: any) {
    console.error("[CosmoPay] Erro ao processar pagamento:", error);
    
    // Tratamento de erros específicos da API do Mercado Pago
    const errorMessage = error.message || "Erro interno ao processar o pagamento.";
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error.cause || error 
    }, { status: 500 });
  }
}
