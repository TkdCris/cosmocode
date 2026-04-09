import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { getMercadoPagoClient } from "@/lib/cosmopay/mercadopago";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // 1. Pegar o Tenant a partir da Query String (enviado na notification_url)
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenant");

    if (!tenantId) {
      console.error("Webhook recebido sem Tenant ID.");
      return NextResponse.json({ error: "Tenant não identificado" }, { status: 400 });
    }

    const body = await req.json();
    console.log(`[CosmoPay Webhook] Notificação recebida para o Tenant: ${tenantId}`, body);

    // 2. Verificar o tópico da notificação
    // O Mercado Pago envia 'type' ou o tópico pode vir de 'action' ou query params de IPN.
    const topic = body.type || body.topic || searchParams.get("topic");
    const paymentId = body.data?.id || body.id || searchParams.get("id");

    if (topic === "payment" && paymentId) {
      // 3. Consultar os dados REAIS do pagamento no Mercado Pago para evitar fraudes
      const client = getMercadoPagoClient(tenantId);
      const payment = new Payment(client);
      
      const paymentDetails = await payment.get({ id: paymentId });
      
      // No SDK v2, os dados podem estar dentro de 'body' ou diretamente no objeto dependendo da versão interna
      // Usamos uma estratégia defensiva para pegar os campos
      const status = paymentDetails.status;
      const external_reference = paymentDetails.external_reference;

      console.log(`[CosmoPay] Pagamento ${paymentId} (Ref: ${external_reference}) atualizado para status: ${status}`);

      if (external_reference) {
        // 4. Atualizar o Banco de Dados (PostgreSQL na Contabo/Local)
        // Buscamos pelo external_reference (que é o ID da nossa Tabela Transaction)
        await prisma.transaction.update({
          where: { id: external_reference },
          data: {
            paymentId: String(paymentId),
            status: status || "unknown",
            updatedAt: new Date(),
          },
        });
      }
    }

    // Mercado Pago exige resposta 200 ou 201 para parar de reenviar a notificação
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no processamento do Webhook CosmoPay:", error);
    // Retornamos 200 mesmo no erro para evitar que o MP fique tentando infinitamente se for erro de lógica nosso
    // Mas logamos o erro para debug.
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
