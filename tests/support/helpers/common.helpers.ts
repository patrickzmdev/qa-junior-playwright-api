import { randomUUID } from "crypto";

/**
 * Gera um email único para testes usando UUID
 */
export function uniqueEmail(prefix: string = "qa"): string {
  const uniqueId = randomUUID();
  return `${prefix}.${uniqueId}@mail.com`;
}

/**
 * Gera um nome único para testes usando UUID curto
 */
export function uniqueName(baseName: string = "Usuario Teste"): string {
  const shortUuid = randomUUID().split("-")[0];
  return `${baseName} ${shortUuid}`;
}
