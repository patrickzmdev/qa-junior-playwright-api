import { APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";
import { IUserPayload } from "../interfaces/UserPayload";
import { IUser } from "../interfaces/User";
import { uniqueName, uniqueEmail } from "./common.helpers";

dotenv.config();

/**
 * Cria um usuário e retorna o objeto completo
 */
export async function createUser(
  request: APIRequestContext,
  userData?: Partial<IUserPayload>
): Promise<IUser> {
  const apiEndpoint = process.env.BASE_URL + "/users";
  const defaultUser: IUserPayload = {
    name: uniqueName("Patrick QA"),
    email: uniqueEmail("patrick.qa"),
    gender: "male",
    status: "active",
    ...userData,
  };

  const response = await request.post(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    data: defaultUser,
  });

  if (response.status() !== 201) {
    throw new Error(
      `Failed to create user: ${response.status()} ${await response.text()}`
    );
  }

  return await response.json();
}

/**
 * Deleta um usuário pelo ID
 */
export async function deleteUser(
  request: APIRequestContext,
  userId: number
): Promise<void> {
  const apiEndpoint = process.env.BASE_URL + "/users";

  await request.delete(`${apiEndpoint}/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  });
}

/**
 * Atualiza um usuário existente
 */
export async function updateUser(
  request: APIRequestContext,
  userId: number,
  updateData: Partial<IUserPayload>
): Promise<IUser> {
  const apiEndpoint = process.env.BASE_URL + "/users";

  const response = await request.put(`${apiEndpoint}/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    data: updateData,
  });

  if (response.status() !== 200) {
    throw new Error(`Erro ao atualizar usuário: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Busca um usuário pelo ID
 */
export async function getUser(
  request: APIRequestContext,
  userId: number
): Promise<IUser | null> {
  const apiEndpoint = process.env.BASE_URL + "/users";

  const response = await request.get(`${apiEndpoint}/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  });

  if (response.status() === 404) {
    return null;
  }

  if (response.status() !== 200) {
    throw new Error(`Erro ao buscar usuário: ${response.status()}`);
  }

  return await response.json();
}
