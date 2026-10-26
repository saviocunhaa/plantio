import { expect, test } from "@playwright/test";

test.describe("Fluxo Principal do Plantio Fácil", () => {
  test("conclui onboarding, inicia cultivo, marca tarefa, usa diário, diagnóstico e assistente sem erros", async ({
    page,
  }) => {
    const errosConsole: string[] = [];
    page.on("pageerror", (err) => errosConsole.push(err.message));

    await page.goto("/");
    await expect(page.getByText("Bem-vindo ao Plantio Fácil")).toBeVisible();

    await page.context().grantPermissions(["geolocation"]);
    await page.context().setGeolocation({ latitude: -7.2131, longitude: -39.3153 });

    await page.getByRole("button", { name: /Começar agora/ }).click();
    await page.getByRole("button", { name: /Usar minha localização/ }).last().click();
    await expect(page.getByText("Qual seu espaço de plantio?")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /Quintal Pequeno/ }).click();
    await page.getByRole("button", { name: /Pleno/ }).click();
    await page.getByRole("button", { name: /Ver recomendações/ }).click();

    await expect(page.locator("a[href^='/cultura/']").first()).toBeVisible();

    await page.goto("/cultura/alface");
    await expect(page.getByText("Calculadora de Espaço e Mudas")).toBeVisible();
    await page.getByRole("button", { name: /Começar a plantar/ }).click();

    await expect(page).toHaveURL(/aba=plantios/);
    await expect(page.getByRole("heading", { name: "Alface Crespa" })).toBeVisible();

    await page.getByRole("button", { name: /Ver diário/ }).click();
    await page.getByPlaceholder(/primeira folha/).fill("Primeira rega feita hoje");
    await page.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(page.getByText("Primeira rega feita hoje")).toBeVisible();

    await page.getByRole("button", { name: /Hoje/ }).first().click();
    await page.getByRole("button", { name: "Marcar feito" }).first().click();
    await expect(page.getByRole("button", { name: /✓ Feito/ }).first()).toBeVisible();

    await page.getByRole("button", { name: /Diagnóstico Foliar/ }).click();
    await page.getByRole("button", { name: /Analisar/ }).click();
    await expect(page.getByText("Diagnóstico Identificado")).toBeVisible();
    await page.getByRole("button", { name: "✕" }).click();

    await page.getByRole("button", { name: /Assistente/ }).last().click();
    await page.getByPlaceholder(/folhas estão amarelando/).fill("Com que frequência devo regar?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByText("O que fazer hoje:").first()).toBeVisible();

    expect(errosConsole).toEqual([]);
  });
});
