import { APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import { IPostPayload } from "../interfaces/PostPayload";
import { IPost } from "../interfaces/Post";

dotenv.config();

/**
 * Cria um post e retorna o objeto completo
 */
export async function createPost(
  request: APIRequestContext,
  userId: number,
  postData?: Partial<IPostPayload>
): Promise<IPost> {
  const apiEndpoint = process.env.BASE_URL + "/posts";
  const defaultPost: IPostPayload = {
    user_id: userId,
    title: `Post de Teste ${randomUUID().split("-")[0]}`,
    body: `Corpo do post de teste`,
    ...postData,
  };

  const response = await request.post(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    data: defaultPost,
  });

  if (response.status() !== 201) {
    throw new Error(
      `Failed to create post: ${response.status()} ${await response.text()}`
    );
  }

  return await response.json();
}

/**
 * Deleta um post pelo ID
 */
export async function deletePost(
  request: APIRequestContext,
  postId: number
): Promise<void> {
  const apiEndpoint = process.env.BASE_URL + "/posts";

  await request.delete(`${apiEndpoint}/${postId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  });
}

/**
 * Atualiza um post existente
 */
export async function updatePost(
  request: APIRequestContext,
  postId: number,
  updateData: Partial<IPostPayload>
): Promise<IPost> {
  const apiEndpoint = process.env.BASE_URL + "/posts";

  const response = await request.put(`${apiEndpoint}/${postId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    data: updateData,
  });

  if (response.status() !== 200) {
    throw new Error(`Erro ao atualizar post: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Busca um post pelo ID
 */
export async function getPost(
  request: APIRequestContext,
  postId: number
): Promise<IPost | null> {
  const apiEndpoint = process.env.BASE_URL + "/posts";

  const response = await request.get(`${apiEndpoint}/${postId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  });

  if (response.status() === 404) {
    return null;
  }

  if (response.status() !== 200) {
    throw new Error(`Erro ao buscar post: ${response.status()}`);
  }

  return await response.json();
}
