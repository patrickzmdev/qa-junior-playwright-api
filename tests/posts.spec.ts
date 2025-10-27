import { test, expect } from "@playwright/test";
import {
  createUser,
  deleteUser,
  createPost,
  deletePost,
  updatePost,
  getPost,
} from "./support/helpers";

test.describe("Posts API - Testes Independentes", () => {
  const apiEndpoint = process.env.BASE_URL + "/posts";

  test("deve criar um novo post", async ({ request }) => {
    // Cria um usuário primeiro (posts precisam de user_id)
    const user = await createUser(request);

    // Cria o post
    const post = await createPost(request, user.id, {
      title: "Meu primeiro post",
      body: "Conteúdo do primeiro post",
    });

    expect(post).toMatchObject({
      id: expect.any(Number),
      user_id: user.id,
      title: "Meu primeiro post",
      body: "Conteúdo do primeiro post",
    });

    // Cleanup
    await deletePost(request, post.id);
    await deleteUser(request, user.id);
  });

  test("deve listar posts", async ({ request }) => {
    const response = await request.get(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    expect(response.status()).toBe(200);
    const posts = await response.json();

    expect(Array.isArray(posts)).toBeTruthy();
    if (posts.length > 0) {
      expect(posts[0]).toHaveProperty("id");
      expect(posts[0]).toHaveProperty("user_id");
      expect(posts[0]).toHaveProperty("title");
      expect(posts[0]).toHaveProperty("body");
    }
  });

  test("deve buscar um post específico", async ({ request }) => {
    // Cria usuário e post para o teste
    const user = await createUser(request);
    const createdPost = await createPost(request, user.id);

    // Busca o post
    const post = await getPost(request, createdPost.id);

    expect(post).not.toBeNull();
    expect(post?.id).toBe(createdPost.id);
    expect(post?.user_id).toBe(user.id);

    // Cleanup
    await deletePost(request, createdPost.id);
    await deleteUser(request, user.id);
  });

  test("deve atualizar um post existente", async ({ request }) => {
    // Cria usuário e post
    const user = await createUser(request);
    const createdPost = await createPost(request, user.id, {
      title: "Título Original",
      body: "Conteúdo Original",
    });

    // Atualiza o post
    const updatedPost = await updatePost(request, createdPost.id, {
      title: "Título Atualizado",
      body: "Conteúdo Atualizado",
    });

    expect(updatedPost.id).toBe(createdPost.id);
    expect(updatedPost.title).toBe("Título Atualizado");
    expect(updatedPost.body).toBe("Conteúdo Atualizado");

    // Cleanup
    await deletePost(request, createdPost.id);
    await deleteUser(request, user.id);
  });

  test("deve deletar um post", async ({ request }) => {
    // Cria usuário e post
    const user = await createUser(request);
    const createdPost = await createPost(request, user.id);

    // Deleta o post
    await deletePost(request, createdPost.id);

    // Verifica que foi deletado (deve retornar null)
    const deletedPost = await getPost(request, createdPost.id);
    expect(deletedPost).toBeNull();

    // Cleanup do usuário
    await deleteUser(request, user.id);
  });
});
