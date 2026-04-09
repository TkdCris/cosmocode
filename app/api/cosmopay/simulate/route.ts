import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Rota utilitária de DESENVOLVIMENTO para simular a aprovação de um pagamento.
 * Isso permite testar o fluxo pós-pagamento sem precisar de um cartão real ou webhook externo.
 */
export async function POST(req: NextRequest) {
  // Segurança Básica: Só funciona em ambiente de desenvolvimento
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Acesso restrito a ambiente de desenvolvimento." }, { status: 403 });
  }

  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId é obrigatório." }, { status: 400 });
    }

    // Atualiza a transação para aprovado no nosso banco de dados
    const updated = await prisma.transaction.updateMany({
        where: { paymentId: String(paymentId) },
        data: {
            status: "approved",
            metadata: {
                simulation: true,
                simulated_at: new Date().toISOString()
            }
        }
    });

    if (updated.count === 0) {
        return NextResponse.json({ error: "Transação não encontrada." }, { status: 404 });
    }

    console.log(`[CosmoPay] 🧪 Pagamento ${paymentId} simulado como APROVADO.`);

    return NextResponse.json({ success: true, message: "Pagamento simulado com sucesso!" });

  } catch (error: any) {
    console.error("[CosmoPay] Erro na simulação:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
