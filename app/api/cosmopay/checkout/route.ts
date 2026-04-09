import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { getMercadoPagoClient, getTenantPublicKey } from "@/lib/cosmopay/mercadopago";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, tenantId, back_urls, metadata } = body;

    // 1. Identificação do Tenant (via payload ou header customizado)
    const activeTenantId = tenantId || req.headers.get("x-tenant-id");

    if (!activeTenantId) {
      return NextResponse.json({ error: "Tenant ID não fornecido." }, { status: 400 });
    }

    // 2. Inicializar Cliente MP do Tenant
    const client = getMercadoPagoClient(activeTenantId);
    const preference = new Preference(client);

    // 3. Criar Transação Pendente no Banco de Dados (PostgreSQL Contabo/Local) primeiro para ter o ID
    const transaction = await prisma.transaction.create({
      data: {
        tenantId: activeTenantId,
        amount: items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0),
        status: "pending",
        preferenceId: "temp_" + Date.now(), // Temporário, atualizaremos após criar no MP
        metadata: metadata || {},
      },
    });

    // 4. Configurar URL de Webhook (Dinâmica por Tenant)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sua-url-ngrok.ngrok-free.app";
    const notificationUrl = `${baseUrl}/api/cosmopay/webhook?tenant=${activeTenantId}`;

    // 5. Criar Preferência no Mercado Pago com link para nossa Transação
    const preferenceData = await preference.create({
      body: {
        items: items,
        external_reference: transaction.id, // Vínculo essencial para o Webhook
        back_urls: back_urls || {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        auto_return: "approved",
        notification_url: notificationUrl,
        metadata: {
          ...metadata,
          tenant_id: activeTenantId,
        },
      },
    });

    // 6. Atualizar a transação com o Preference ID real
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { preferenceId: preferenceData.id! },
    });

    // 7. Retornar IDs e Public Key
    return NextResponse.json({
      preferenceId: preferenceData.id,
      publicKey: getTenantPublicKey(activeTenantId),
      transactionId: transaction.id,
    });

  } catch (error: any) {
    console.error("Erro no CosmoPay Checkout:", error);
    return NextResponse.json({ 
      error: "Falha ao criar preferência de pagamento.",
      details: error.message 
    }, { status: 500 });
  }
}
