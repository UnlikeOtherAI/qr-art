import { expect, test } from "@playwright/test";

test("renders QR codes and supports all visual controls", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/");
  await expect(page.locator("#qr svg")).toHaveCount(1);
  await expect(page.locator("#download")).toBeEnabled();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download SVG" }).click();
  expect((await download).suggestedFilename()).toBe("qr-code.svg");

  await page.selectOption("#colorMode", "rainbow");
  await expect(page.locator("#codeColorField")).toBeHidden();
  await expect(page.locator("#qr svg")).toHaveCount(1);
  await expect(page.locator('#qr svg [fill="#ef4444"]').first()).toBeAttached();

  await page.selectOption("#style", "dot");
  await expect(page.locator("#cornerRadiusField")).toBeHidden();
  await expect(page.locator("#qr svg circle").first()).toBeVisible();

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
