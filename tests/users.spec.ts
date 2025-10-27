import { test, expect } from "@playwright/test";
import {
  createUser,
  deleteUser,
  uniqueEmail,
  uniqueName,
} from "./support/helpers";
import { IUserPayload } from "./support/interfaces/UserPayload";

test.describe("Users API - Testes Independentes", () => {
  const apiEndpoint = process.env.BASE_URL + "/users";

  test("deve criar um novo usuário", async ({ request }) => {
    const userPayload: IUserPayload = {
      name: uniqueName("Patrick QA"),
      gender: "male",
      email: uniqueEmail("patrick.qa"),
      status: "active",
    };

    const createResponse = await request.post(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
      data: userPayload,
    });

    expect(createResponse.status()).toBe(201);
    const createdUser = await createResponse.json();

    expect(createdUser).toMatchObject({
      id: expect.any(Number),
      name: userPayload.name,
      gender: userPayload.gender,
      email: userPayload.email,
      status: userPayload.status,
    });

    // Cleanup: remove o usuário criado
    await deleteUser(request, createdUser.id);
  });

  test("deve exibir um usuário existente", async ({ request }) => {
    // Cria um usuário para este teste específico
    const createdUser = await createUser(request, {
      name: "Usuario para GET",
      gender: "female",
    });

    // Testa o GET
    const getResponse = await request.get(`${apiEndpoint}/${createdUser.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    expect(getResponse.status()).toBe(200);
    const retrievedUser = await getResponse.json();

    expect(retrievedUser).toMatchObject({
      id: createdUser.id,
      name: createdUser.name,
      gender: createdUser.gender,
      email: createdUser.email,
      status: createdUser.status,
    });

    // Cleanup: remove o usuário
    await deleteUser(request, createdUser.id);
  });

  test("deve atualizar um usuário existente", async ({ request }) => {
    // Cria um usuário para este teste específico
    const createdUser = await createUser(request, {
      name: "Usuario Original",
      status: "active",
    });

    // Testa o UPDATE
    const updatePayload = {
      name: "Usuario Atualizado",
      status: "inactive" as const,
    };

    const updateResponse = await request.put(
      `${apiEndpoint}/${createdUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
        data: updatePayload,
      }
    );

    expect(updateResponse.status()).toBe(200);
    const updatedUser = await updateResponse.json();

    expect(updatedUser).toMatchObject({
      id: createdUser.id,
      name: updatePayload.name,
      status: updatePayload.status,
    });

    // Cleanup: remove o usuário
    await deleteUser(request, createdUser.id);
  });

  test("deve remover um usuário", async ({ request }) => {
    // Cria um usuário para este teste específico
    const createdUser = await createUser(request, {
      name: "Usuario para Deletar",
    });

    // Testa o DELETE
    const deleteResponse = await request.delete(
      `${apiEndpoint}/${createdUser.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );

    expect(deleteResponse.status()).toBe(204);

    // Verifica que foi realmente deletado (deve retornar 404)
    const getResponse = await request.get(`${apiEndpoint}/${createdUser.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
    expect(getResponse.status()).toBe(404);
  });
});
