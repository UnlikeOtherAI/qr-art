import { expect, test, type Download } from "@playwright/test";

async function downloadedBytes(download: Download) {
  const stream = await download.createReadStream();
  if (!stream) throw new Error("The download stream was not available.");
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

test("renders QR codes and supports all visual controls", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/");
  await expect(page.locator("#qr svg")).toHaveCount(1);
  await expect(page.locator("#download")).toBeEnabled();
  await expect(page.locator("#downloadPng")).toBeEnabled();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download SVG" }).click();
  expect((await download).suggestedFilename()).toBe("qr-code.svg");

  const pngDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const png = await pngDownload;
  expect(png.suggestedFilename()).toBe("qr-code.png");
  expect((await downloadedBytes(png)).subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

  await page.selectOption("#colorMode", "rainbow");
  await expect(page.locator("#codeColorField")).toBeHidden();
  await expect(page.locator("#qr svg")).toHaveCount(1);
  await expect(page.locator('#qr svg [fill="#ef4444"]').first()).toBeAttached();

  await expect(page.locator("#cornerRadiusField")).toBeVisible();
  await page.selectOption("#style", "dot");
  await expect(page.locator("#cornerRadius")).toHaveValue("100");
  await expect(page.locator("#qr svg circle").first()).toBeVisible();

  await page.locator("#cornerRadius").evaluate((input: HTMLInputElement) => {
    input.value = "0";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator("#style")).toHaveValue("square");
  await expect(page.locator("#cornerRadiusValue")).toHaveText("0%");
  await expect(page.locator("#qr svg circle")).toHaveCount(0);

  await page.locator("#cornerRadius").evaluate((input: HTMLInputElement) => {
    input.value = "45";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator("#style")).toHaveValue("rounded");
  await expect(page.locator("#cornerRadiusValue")).toHaveText("45%");

  await page.locator("#cornerRadius").evaluate((input: HTMLInputElement) => {
    input.value = "100";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator("#style")).toHaveValue("dot");
  await expect(page.locator("#qr svg circle").first()).toBeVisible();

  await page.locator("#size").evaluate((input: HTMLInputElement) => {
    input.value = "640";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator("#sizeValue")).toHaveText("640");
  await expect(page.locator("#qr svg")).toHaveAttribute("width", "640");

  await page.setInputFiles("#logoFile", {
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#5147e7" d="M12 12h76v76H12z"/><path fill="white" d="M35 30h30v40H35z"/></svg>'),
    mimeType: "image/svg+xml",
    name: "mark.svg",
  });
  await expect(page.locator("#logoOptions")).toBeVisible();
  await expect(page.locator("#logoStatus")).toHaveText("mark.svg");
  await expect(page.locator("#qr svg image")).toHaveCount(1);
  await expect(page.locator("#qr svg image")).toHaveAttribute("href", /^data:image\/svg\+xml/);

  await page.selectOption("#logoColorMode", "single");
  await expect(page.locator("#logoColorField")).toBeVisible();
  await expect(page.locator("#qr svg image")).toHaveCount(1);
  await expect(page.locator("#qr svg image")).toHaveAttribute("href", /^data:image\/png/);
  expect(browserErrors).toEqual([]);
});
