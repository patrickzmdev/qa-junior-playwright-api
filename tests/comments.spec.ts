import { test, expect } from "@playwright/test";
import {
  createUser,
  deleteUser,
  createPost,
  deletePost,
  createComment,
  deleteComment,
  updateComment,
  getComment,
} from "./support/helpers";

test.describe("Comments testes CRUD", () => {
  const apiEndpoint = process.env.BASE_URL + "/comments";

  test("deve criar um novo comentário", async ({ request }) => {
    // Cria usuário e post primeiro
    const user = await createUser(request);
    const post = await createPost(request, user.id);

    // Cria o comentário
    const comment = await createComment(request, post.id, {
      name: "João Silva",
      body: "Excelente post!",
    });

    expect(comment).toMatchObject({
      id: expect.any(Number),
      post_id: post.id,
      name: "João Silva",
      email: expect.stringContaining("@"),
      body: "Excelente post!",
    });

    // Cleanup
    await deleteComment(request, comment.id);
    await deletePost(request, post.id);
    await deleteUser(request, user.id);
  });

  test("deve listar comentários", async ({ request }) => {
    const response = await request.get(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    expect(response.status()).toBe(200);
    const comments = await response.json();

    expect(Array.isArray(comments)).toBeTruthy();
    if (comments.length > 0) {
      expect(comments[0]).toHaveProperty("id");
      expect(comments[0]).toHaveProperty("post_id");
      expect(comments[0]).toHaveProperty("name");
      expect(comments[0]).toHaveProperty("email");
      expect(comments[0]).toHaveProperty("body");
    }
  });

  test("deve buscar um comentário específico", async ({ request }) => {
    // Cria usuário, post e comentário
    const user = await createUser(request);
    const post = await createPost(request, user.id);
    const createdComment = await createComment(request, post.id);

    // Busca o comentário
    const comment = await getComment(request, createdComment.id);

    expect(comment).not.toBeNull();
    expect(comment?.id).toBe(createdComment.id);
    expect(comment?.post_id).toBe(post.id);

    // Cleanup
    await deleteComment(request, createdComment.id);
    await deletePost(request, post.id);
    await deleteUser(request, user.id);
  });

  test("deve atualizar um comentário existente", async ({ request }) => {
    // Cria usuário, post e comentário
    const user = await createUser(request);
    const post = await createPost(request, user.id);
    const createdComment = await createComment(request, post.id, {
      name: "Nome Original",
      body: "Comentário Original",
    });

    // Atualiza o comentário
    const updatedComment = await updateComment(request, createdComment.id, {
      name: "Nome Atualizado",
      body: "Comentário Atualizado",
    });

    expect(updatedComment.id).toBe(createdComment.id);
    expect(updatedComment.name).toBe("Nome Atualizado");
    expect(updatedComment.body).toBe("Comentário Atualizado");

    // Cleanup
    await deleteComment(request, createdComment.id);
    await deletePost(request, post.id);
    await deleteUser(request, user.id);
  });

  test("deve deletar um comentário", async ({ request }) => {
    // Cria usuário, post e comentário
    const user = await createUser(request);
    const post = await createPost(request, user.id);
    const createdComment = await createComment(request, post.id);

    // Deleta o comentário
    await deleteComment(request, createdComment.id);

    // Verifica que foi deletado (deve retornar null)
    const deletedComment = await getComment(request, createdComment.id);
    expect(deletedComment).toBeNull();

    // Cleanup
    await deletePost(request, post.id);
    await deleteUser(request, user.id);
  });

  test("deve listar comentários de um post específico", async ({ request }) => {
    // Cria usuário, post e alguns comentários
    const user = await createUser(request);
    const post = await createPost(request, user.id);
    const comment1 = await createComment(request, post.id);
    const comment2 = await createComment(request, post.id);

    // Lista comentários do post
    const response = await request.get(
      `${process.env.BASE_URL}/posts/${post.id}/comments`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );

    expect(response.status()).toBe(200);
    const comments = await response.json();

    expect(Array.isArray(comments)).toBeTruthy();
    // Verifica que todos os comentários pertencem ao post
    comments.forEach((comment: any) => {
      expect(comment.post_id).toBe(post.id);
    });

    // Cleanup
    await deleteComment(request, comment1.id);
    await deleteComment(request, comment2.id);
    await deletePost(request, post.id);
    await deleteUser(request, user.id);
  });
});
