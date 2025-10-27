import { APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";
import { ICommentPayload } from "../interfaces/CommentPayload";
import { IComment } from "../interfaces/Comment";
import { uniqueName, uniqueEmail } from "./common.helpers";

dotenv.config();

/**
 * Cria um comentário e retorna o objeto completo
 */
export async function createComment(
  request: APIRequestContext,
  postId: number,
  commentData?: Partial<ICommentPayload>
): Promise<IComment> {
  const apiEndpoint = process.env.BASE_URL + "/comments";
  const defaultComment: ICommentPayload = {
    post_id: postId,
    name: uniqueName("Usuario que comenta"),
    email: uniqueEmail("comment"),
    body: `Comentário de teste`,
    ...commentData,
  };

  const response = await request.post(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    data: defaultComment,
  });

  if (response.status() !== 201) {
    throw new Error(
      `Failed to create comment: ${response.status()} ${await response.text()}`
    );
  }

  return await response.json();
}

/**
 * Deleta um comentário pelo ID
 */
export async function deleteComment(
  request: APIRequestContext,
  commentId: number
): Promise<void> {
  const apiEndpoint = process.env.BASE_URL + "/comments";

  await request.delete(`${apiEndpoint}/${commentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  });
}

/**
 * Atualiza um comentário existente
 */
export async function updateComment(
  request: APIRequestContext,
  commentId: number,
  updateData: Partial<ICommentPayload>
): Promise<IComment> {
  const apiEndpoint = process.env.BASE_URL + "/comments";

  const response = await request.put(`${apiEndpoint}/${commentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    data: updateData,
  });

  if (response.status() !== 200) {
    throw new Error(`Erro ao atualizar comentário: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Busca um comentário pelo ID
 */
export async function getComment(
  request: APIRequestContext,
  commentId: number
): Promise<IComment | null> {
  const apiEndpoint = process.env.BASE_URL + "/comments";

  const response = await request.get(`${apiEndpoint}/${commentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  });

  if (response.status() === 404) {
    return null;
  }

  if (response.status() !== 200) {
    throw new Error(`Erro ao buscar comentário: ${response.status()}`);
  }

  return await response.json();
}
