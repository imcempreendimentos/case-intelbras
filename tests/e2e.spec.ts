import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "https://frontend-xi-livid-19.vercel.app";
const VALID_TOKEN = process.env.TEST_VALID_TOKEN || "";
const INVALID_TOKEN = "token_invalido_123";

test.describe("Case Intelbras — Tela de Autenticação", () => {
  test("CT-01: Deve exibir tela de token ao acessar", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByRole("textbox")).toBeVisible();
    await expect(page.getByRole("button", { name: /conectar/i })).toBeVisible();
    await expect(page.getByAltText("Intelbras")).toBeVisible();
  });

  test("CT-02: Deve exibir erro ao submeter campo vazio", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("button", { name: /conectar/i }).click();
    await expect(page.getByText("Por favor, insira seu token de acesso.")).toBeVisible();
  });

  test("CT-03: Deve permanecer na tela de login com token inválido", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("textbox").fill(INVALID_TOKEN);
    await page.getByRole("button", { name: /conectar/i }).click();

    // Deve mostrar erro na tela de token, NÃO na tela interna
    await expect(page.getByText(/token inválido/i)).toBeVisible({ timeout: 15000 });
    // Não deve mostrar o header com "Sair"
    await expect(page.getByRole("button", { name: /sair/i })).not.toBeVisible();
  });
});

test.describe("Case Intelbras — Listagem de Dispositivos (RF02)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("textbox").fill(VALID_TOKEN);
    await page.getByRole("button", { name: /conectar/i }).click();
    // Aguardar carregamento dos dispositivos
    await expect(page.getByText(/dispositivo\(s\)/i)).toBeVisible({ timeout: 15000 });
  });

  test("CT-04: Deve exibir lista de dispositivos após token válido", async ({ page }) => {
    // Deve ter cards de dispositivos
    await expect(page.getByText("MCA 1002-4931")).toBeVisible();
    await expect(page.getByText("iM1-47IC")).toBeVisible();
  });

  test("CT-05: Deve exibir badges de status online/offline", async ({ page }) => {
    // Buscar badges dentro dos cards (span com classe rounded-full)
    const onlineBadges = page.locator("span.rounded-full", { hasText: "Online" });
    const offlineBadges = page.locator("span.rounded-full", { hasText: "Offline" });
    await expect(onlineBadges.first()).toBeVisible();
    await expect(offlineBadges.first()).toBeVisible();
  });

  test("CT-06: Deve exibir contagem de dispositivos", async ({ page }) => {
    await expect(page.getByText(/10 dispositivo\(s\)/i)).toBeVisible();
  });
});

test.describe("Case Intelbras — Filtros (RF03, RF07)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("textbox").fill(VALID_TOKEN);
    await page.getByRole("button", { name: /conectar/i }).click();
    await expect(page.getByText(/dispositivo\(s\)/i)).toBeVisible({ timeout: 15000 });
  });

  test("CT-07: Deve filtrar por busca de nome", async ({ page }) => {
    await page.getByPlaceholder(/buscar/i).fill("iM1");
    // Deve mostrar apenas o iM1
    await expect(page.getByText("iM1-47IC")).toBeVisible();
    // Não deve mostrar outros
    await expect(page.getByText("MCA 1002-4931")).not.toBeVisible();
  });

  test("CT-08: Deve filtrar por busca de modelo", async ({ page }) => {
    await page.getByPlaceholder(/buscar/i).fill("MFR");
    // Deve mostrar os MFR
    await expect(page.getByText("MFR 2030-1AF4")).toBeVisible();
    await expect(page.getByText("MFR 2040-3BA4")).toBeVisible();
  });

  test("CT-09: Deve filtrar por status online", async ({ page }) => {
    await page.getByLabel(/filtrar por status/i).selectOption("online");
    // Deve mostrar apenas online
    await expect(page.getByText("MCA 1002-4931")).toBeVisible();
    // Não deve mostrar offline
    await expect(page.getByText("MFR 2030-1AF4")).not.toBeVisible();
  });

  test("CT-10: Deve filtrar por status offline", async ({ page }) => {
    await page.getByLabel(/filtrar por status/i).selectOption("offline");
    // Deve mostrar offline
    await expect(page.getByText("MSI 1001-F159")).toBeVisible();
    // Não deve mostrar online
    await expect(page.getByText("iM1-47IC")).not.toBeVisible();
  });
});

test.describe("Case Intelbras — Detalhes do Dispositivo (RF06)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("textbox").fill(VALID_TOKEN);
    await page.getByRole("button", { name: /conectar/i }).click();
    await expect(page.getByText(/dispositivo\(s\)/i)).toBeVisible({ timeout: 15000 });
  });

  test("CT-11: Deve abrir drawer com detalhes ao clicar no card", async ({ page }) => {
    await page.getByLabel(/detalhes de MCA 1002-4931/i).click();
    // Drawer deve aparecer
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Detalhes do Dispositivo")).toBeVisible();
    // Deve ter informações do dispositivo dentro do drawer
    await expect(drawer.getByText("IOT-ZG2-IB")).toBeVisible(); // modelo
    await expect(drawer.getByText("AEBM010384931")).toBeVisible(); // ns
  });

  test("CT-12: Deve fechar drawer ao clicar no X", async ({ page }) => {
    await page.getByLabel(/detalhes de MCA 1002-4931/i).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByLabel("Fechar").click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("CT-13: Deve fechar drawer ao clicar no overlay", async ({ page }) => {
    await page.getByLabel(/detalhes de MCA 1002-4931/i).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // Clicar no overlay (fora do drawer)
    await page.locator("[aria-hidden='true']").click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test.describe("Case Intelbras — Header e Desconexão", () => {
  test("CT-14: Deve desconectar e voltar à tela de token", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("textbox").fill(VALID_TOKEN);
    await page.getByRole("button", { name: /conectar/i }).click();
    await expect(page.getByText(/dispositivo\(s\)/i)).toBeVisible({ timeout: 15000 });

    // Clicar em sair
    await page.getByLabel(/sair/i).click();

    // Deve voltar à tela de token
    await expect(page.getByRole("button", { name: /conectar/i })).toBeVisible();
    await expect(page.getByAltText("Intelbras")).toBeVisible();
  });
});

test.describe("Case Intelbras — Acessibilidade", () => {
  test("CT-15: Deve ter lang=pt-BR no HTML", async ({ page }) => {
    await page.goto(BASE_URL);
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("pt-BR");
  });

  test("CT-16: Deve ter labels acessíveis nos inputs", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByLabel(/token de acesso/i)).toBeVisible();
  });

  test("CT-17: Logo deve ter alt text", async ({ page }) => {
    await page.goto(BASE_URL);
    const logo = page.getByAltText("Intelbras");
    await expect(logo).toBeVisible();
  });
});
