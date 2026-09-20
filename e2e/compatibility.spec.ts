import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

const uncommonFixture = fileURLToPath(
  new URL("../src/test/fixtures/current-v4-uncommon.eds", import.meta.url),
);
const roundTripAddress = "Oprit <b>laadpunt</b>";
const safeSituationLabel = "Hal <b>laadpunt</b>";

async function loadExample(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Keep file handling deterministic: exercise the browser-download fallback
    // instead of Chromium's platform-dependent File System Access picker.
    delete (window as Window & { showOpenFilePicker?: unknown }).showOpenFilePicker;
  });
  await page.goto("/");
  await expect(page.getByText("Welkom op ééndraadschema")).toBeVisible();
  await page.locator("#start-example-0").click();
  await expect(page.getByRole("navigation", { name: "Elektrische hiërarchie" })).toBeVisible();
}

async function selectBySearch(page: Page, query: string): Promise<void> {
  const search = page.getByRole("searchbox", { name: "Zoeken in het schema" });
  await search.fill(query);
  await expect(page.getByRole("search").getByRole("status")).toContainText("gevonden");
  await page.getByRole("search").getByRole("button").first().click();
}

test("opens a version-4 fixture and preserves uncommon items and links through an EDS round trip", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await loadExample(page);
  await page.locator("#importfile").setInputFiles(uncommonFixture);

  const schematic = page.locator("#right_col_inner #EDS svg");
  await expect(schematic).toContainText("Garagebord");
  await selectBySearch(page, "EV lader");
  await expect(page.locator("#react-hierarchy-root [aria-current='true']")).toContainText("EV lader");

  const properties = page.locator("#react-properties-root");
  const address = properties.getByLabel("Adres of tekst");
  await expect(address).toHaveValue("Garage");
  await address.fill(roundTripAddress);
  await address.blur();
  await expect(schematic).toContainText(roundTripAddress);

  await page.getByRole("navigation", { name: "Werkruimteweergave" })
    .getByRole("button", { name: "Situatieschema" }).click();
  const noticeOk = page.getByRole("button", { name: "OK" });
  if (await noticeOk.isVisible()) await noticeOk.click();
  expect(pageErrors).toEqual([]);
  await expect(page.locator(".vite-error-overlay")).toHaveCount(0);
  const situationBox = page.locator("#paper .box");
  await expect(situationBox).toHaveCount(1);
  await situationBox.click();
  const placementInspector = page.getByRole("region", { name: "Eigenschappen van situatiesymbool" });
  await placementInspector.getByLabel("Bron").selectOption("manueel");
  await placementInspector.getByLabel("Adres", { exact: true }).fill(safeSituationLabel);
  await placementInspector.getByLabel("Adres", { exact: true }).blur();
  const situationLabel = page.locator('#paper [id$="_label"]');
  await expect(situationLabel).toHaveText(safeSituationLabel);
  await expect(situationLabel.locator("b")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Nog te plaatsen" })).toContainText(/1 van 1 veldsymbolen geplaatst/);
  await expect(page.getByRole("region", { name: "Nog te plaatsen" })).toContainText("Alles geplaatst");

  await page.getByRole("navigation", { name: "Applicatiemenu" })
    .getByRole("button", { name: "Bestand" }).click();
  const fileDialog = page.getByRole("dialog", { name: "Bestand" });
  await fileDialog.getByLabel("Bestandsnaam").fill("compatibility-roundtrip.eds");
  const downloadPromise = page.waitForEvent("download");
  await fileDialog.getByRole("button", { name: "Opslaan", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("compatibility-roundtrip.eds");
  const savedPath = await download.path();
  expect(savedPath).not.toBeNull();
  await fileDialog.getByRole("button", { name: "Sluiten" }).click();

  await page.getByRole("navigation", { name: "Werkruimteweergave" })
    .getByRole("button", { name: "Eéndraadschema" }).click();
  await selectBySearch(page, "EV lader");
  await properties.getByLabel("Adres of tekst").fill("Tijdelijke wijziging");
  await properties.getByLabel("Adres of tekst").blur();
  await expect(schematic).toContainText("Tijdelijke wijziging");

  await page.locator("#importfile").setInputFiles(savedPath!);
  await expect(schematic).toContainText(roundTripAddress);
  await expect(schematic).not.toContainText("Tijdelijke wijziging");
  await selectBySearch(page, "Overspanningsbeveiliging");
  await expect(page.locator("#react-hierarchy-root [aria-current='true']"))
    .toContainText("Overspanningsbeveiliging");
});

test("downloads the visible print page as a valid SVG", async ({ page }) => {
  await loadExample(page);
  await page.getByRole("navigation", { name: "Applicatiemenu" })
    .getByRole("button", { name: "Print" }).click();
  const printDialog = page.getByRole("dialog", { name: "Afdrukken" });
  await expect(printDialog.locator('[aria-label="Afdrukvoorbeeld"] > div > svg')).toBeVisible();

  await printDialog.getByLabel("SVG-bestandsnaam").fill("compatibility-preview.svg");
  const downloadPromise = page.waitForEvent("download");
  await printDialog.getByRole("button", { name: "SVG downloaden" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("compatibility-preview.svg");
  const svgPath = await download.path();
  expect(svgPath).not.toBeNull();
  const svg = await readFile(svgPath!, "utf8");
  expect(svg).toMatch(/^<svg[\s>]/);
  expect(svg).toContain("xmlns=\"http://www.w3.org/2000/svg\"");
  expect(svg).toContain("Keuken");
});

test("generates a downloadable PDF for an explicit page range", async ({ page }) => {
  await loadExample(page);
  await page.getByRole("navigation", { name: "Applicatiemenu" })
    .getByRole("button", { name: "Print" }).click();
  const printDialog = page.getByRole("dialog", { name: "Afdrukken" });
  await printDialog.getByLabel("Resolutie").selectOption("150");
  await printDialog.getByLabel("Paginabereik").fill("1");
  await printDialog.getByLabel("PDF-bestandsnaam").fill("compatibility-preview.pdf");
  page.once("dialog", dialog => dialog.accept());

  const downloadPromise = page.waitForEvent("download");
  await printDialog.getByRole("button", { name: "PDF genereren" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("compatibility-preview.pdf");
  const pdfPath = await download.path();
  expect(pdfPath).not.toBeNull();
  const pdf = await readFile(pdfPath!);
  expect(pdf.subarray(0, 5).toString("ascii")).toBe("%PDF-");
  expect(pdf.byteLength).toBeGreaterThan(1_000);
  await expect(printDialog.getByRole("status")).toContainText("PDF is klaar");
});
