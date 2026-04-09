import { MercadoPagoConfig } from 'mercadopago';

/**
 * CosmoPay SDK Factory
 * Esta função inicializa o SDK do Mercado Pago dinamicamente baseado no Tenant (Loja).
 * 
 * @param tenantId Identificador da loja (ex: 'COSMOCODE', 'ASPECTUS', 'CONTROLE')
 * @returns Instância configurada do MercadoPagoConfig
 */
export function getMercadoPagoClient(tenantId: string) {
  const envKey = `MP_ACCESS_TOKEN_${tenantId.toUpperCase().replace(/\s+/g, '_')}`;
  const accessToken = process.env[envKey];

  if (!accessToken) {
    throw new Error(`Credenciais não encontradas para o tenant: ${tenantId}. Verifique a variável ${envKey} no .env`);
  }

  return new MercadoPagoConfig({
    accessToken: accessToken,
    options: {
      timeout: 5000,
    }
  });
}

/**
 * Retorna a Chave Pública do tenant para uso no Frontend (se disponível no server e passada via API)
 */
export function getTenantPublicKey(tenantId: string) {
  const envKey = `NEXT_PUBLIC_MP_PUBLIC_KEY_${tenantId.toUpperCase().replace(/\s+/g, '_')}`;
  return process.env[envKey];
}
