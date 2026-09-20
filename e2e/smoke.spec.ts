import { expect, test, type Page } from "@playwright/test";

async function loadExample(page: Page, example: 0 | 1): Promise<void> {
  await page.goto("/");
  await expect(page.getByText("Welkom op ééndraadschema")).toBeVisible();
  await page.locator(`#start-example-${example}`).click();
  await expect(page.getByRole("navigation", { name: "Elektrische hiërarchie" })).toBeVisible();
}

test("loads an example into the React editor with a live SVG preview", async ({ page }) => {
  await loadExample(page, 1);

  await expect(page.locator("#react-hierarchy-root [data-hierarchy-item-id]").first()).toBeVisible();
  await expect(page.locator("#right_col_inner #EDS svg")).toBeVisible();
  await expect(page.getByRole("contentinfo", { name: "Statusbalk van de editor" })).toBeVisible();
  await expect(page.locator("#ribbon")).toBeHidden();
  await expect.poll(() => page.evaluate(() => {
    const canvasWidth = document.getElementById("canvas_2col")?.getBoundingClientRect().width ?? 0;
    const viewportWidth = document.getElementById("right_col")?.getBoundingClientRect().width ?? 0;
    return Math.abs(canvasWidth - viewportWidth);
  })).toBeLessThanOrEqual(1);
});

test("keeps new-document, documentation, and contact flows inside React dialogs", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Fasen").selectOption("4");
  await page.getByLabel("Hoofdzekering (A)").fill("40");
  await page.getByRole("button", { name: "Start met een leeg schema" }).click();
  await expect(page.getByRole("heading", { name: "Werk per kring, niet per tekening" })).toBeVisible();

  await page.getByText("Hulp", { exact: true }).click();
  await page.getByRole("button", { name: "Documentatie" }).click();
  await expect(page.getByRole("dialog", { name: "Documentatie" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open handleiding" })).toHaveCount(2);
  await page.getByRole("button", { name: "Sluiten" }).click();

  await page.getByText("Hulp", { exact: true }).click();
  await page.getByRole("button", { name: "Info en contact" }).click();
  await expect(page.getByRole("dialog", { name: "Info en contact" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open de online versie" })).toBeVisible();
});

test("keeps the workspace compact with adjustable sidebars and a placement queue", async ({ page }) => {
  await loadExample(page, 0);

  const hierarchy = page.getByRole("navigation", { name: "Elektrische hiërarchie" });
  await expect(hierarchy.locator("select[aria-label^='Type van']")).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Zoeken in het schema" }).fill("Contactdoos");
  await page.getByRole("search").getByRole("button").first().click();
  const selectedType = hierarchy.locator("select[aria-label^='Type van']");
  await expect(selectedType).toHaveCount(1);
  await expect(selectedType.locator("optgroup")).not.toHaveCount(0);

  const leftResizeHandle = page.getByRole("separator", { name: "Breedte van navigatie aanpassen" });
  await leftResizeHandle.press("ArrowRight");
  await expect(page.locator("#react-workspace-sidebar")).toHaveCSS("width", "328px");
  await page.getByRole("button", { name: "Navigatie inklappen" }).click();
  await expect.poll(() => page.locator("#react-workspace-sidebar").evaluate(
    element => element.getBoundingClientRect().width,
  )).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "Navigatie tonen" }).click();
  await expect(page.locator("#react-workspace-sidebar")).toHaveCSS("width", "328px");

  await page.getByRole("navigation", { name: "Werkruimteweergave" })
    .getByRole("button", { name: "Situatieschema" }).click();
  const helpDialogOk = page.getByRole("button", { name: "OK" });
  if (await helpDialogOk.isVisible()) await helpDialogOk.click();
  const placementQueue = page.getByRole("region", { name: "Nog te plaatsen" });
  await expect(placementQueue).toContainText(/van \d+ veldsymbolen geplaatst/);
  await expect(page.getByLabel("Kring")).toBeVisible();
  await expect(page.getByRole("button", { name: "Plaats" }).first()).toBeVisible();
});

test("creates a circuit through the dossier under the selected board", async ({ page }) => {
  await loadExample(page, 0);

  const workspaceTabs = page.getByRole("navigation", { name: "Werkruimteweergave" });
  await workspaceTabs.getByRole("button", { name: "Dossier" }).click();
  await expect(page.locator("#react-workspace-sidebar")).toHaveClass(/hidden/);
  await expect(page.locator("#properties_col")).toHaveClass(/hidden/);

  await page.getByRole("button", { name: "+ Kring toevoegen" }).click();
  const dialog = page.getByRole("dialog", { name: "Basisgegevens instellen" });
  await expect(dialog.getByLabel("Verdeelbord")).toHaveValue("main");
  await dialog.getByLabel("Kringnaam").fill("Wasplaats");
  await dialog.getByLabel("Stroom (A)").fill("16");
  await dialog.getByLabel("Kabeltype").fill("XVB Cca 3G2,5");
  await dialog.getByRole("button", { name: "Kring aanmaken" }).click();

  await expect(workspaceTabs.getByRole("button", { name: "Eéndraadschema" })).toHaveAttribute("aria-current", "page");
  const selectedRow = page.locator("#react-hierarchy-root [aria-current='true']");
  await expect(selectedRow).toContainText("Kring Wasplaats");
  const properties = page.locator("#react-properties-root");
  await expect(properties.getByLabel("Stroom (A)")).toHaveValue("16");
  await expect(properties.getByLabel("Kabeltype")).toHaveValue("XVB Cca 3G2,5");
});

test("builds a board layout by size, click, and drag-and-drop", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await loadExample(page, 1);

  await page.getByRole("navigation", { name: "Werkruimteweergave" })
    .getByRole("button", { name: "Bordindeling" }).click();
  const boardWorkspace = page.getByRole("region", { name: "Fysieke bordindeling" });
  await expect(boardWorkspace.getByRole("heading", { name: "Stel je verdeelbord samen" })).toBeVisible();
  await expect(page.locator("#react-workspace-sidebar")).toHaveClass(/hidden/);
  await expect(page.locator("#properties_col")).not.toHaveClass("hidden");
  await expect(boardWorkspace.getByRole("combobox", { name: "Verdeelbord" })).toHaveValue("main");
  await boardWorkspace.getByLabel("Modules breed").fill("12");
  await boardWorkspace.getByLabel("Aantal rijen").fill("2");
  await boardWorkspace.getByRole("button", { name: "Formaat toepassen" }).click();
  await expect(page.getByText("12 modules × 2 rijen")).toBeVisible();

  await page.getByRole("button", { name: "Lege positie Rij 1, module 1", exact: true }).click();
  const placementDialog = page.getByRole("form", { name: "Kring op lege positie plaatsen" });
  await expect(placementDialog).toBeVisible();
  await placementDialog.getByLabel("Breedte in modules").fill("2");
  await placementDialog.getByRole("button", { name: "Kring plaatsen" }).click();
  await expect(page.getByText("12 modules × 2 rijen")).toBeVisible();

  const palette = page.getByLabel("Kringen van het verdeelbord");
  const draggableCircuit = palette.locator('button[draggable="true"]').first();
  await draggableCircuit.locator("xpath=..").getByRole("spinbutton").fill("3");
  await draggableCircuit.dragTo(page.getByRole("button", { name: "Lege positie Rij 2, module 3", exact: true }));
  await expect(palette.getByRole("heading", { name: "Geplaatst" })).toBeVisible();
  await expect(page.locator(".vite-error-overlay")).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
});

test("adds components at branch ends and between drawn components", async ({ page }) => {
  await loadExample(page, 0);

  const endTrigger = page.getByRole("button", { name: /na Contactdoos.*toevoegen/ }).first();
  await expect(endTrigger).toBeVisible();
  await endTrigger.click();
  let dialog = page.getByRole("dialog", { name: "Onderdeel toevoegen" });
  await dialog.getByRole("combobox").selectOption("Lichtpunt");
  await dialog.getByRole("button", { name: "Toevoegen" }).click();

  const selectedItem = page.locator("#react-hierarchy-root [aria-current='true']");
  await expect(selectedItem).toContainText("Lichtpunt");
  const insertedLightId = await selectedItem.getAttribute("data-hierarchy-item-id");
  await expect(page.locator(`#right_col_inner [data-schema-item-id="${insertedLightId}"]`).first()).toBeVisible();

  const betweenTrigger = page.getByRole("button", { name: /vóór Lichtpunt.*invoegen/ }).first();
  await expect(betweenTrigger).toBeVisible();
  await betweenTrigger.click();
  dialog = page.getByRole("dialog", { name: "Onderdeel toevoegen" });
  await dialog.getByRole("combobox").selectOption("Contactdoos");
  await dialog.getByRole("button", { name: "Toevoegen" }).click();

  await expect(page.locator("#react-hierarchy-root [aria-current='true']")).toContainText("Contactdoos");
  await expect(page.locator(".vite-error-overlay")).toHaveCount(0);
});

test("links schematic symbols and hierarchy selection in both directions", async ({ page }) => {
  await loadExample(page, 0);

  const schematicLabel = page.locator("#EDSSVG text").filter({ hasText: "Waterkoker" }).first();
  const itemId = await schematicLabel.evaluate((element) =>
    element.closest("[data-schema-item-id]")?.getAttribute("data-schema-item-id"),
  );
  const schematicContainer = schematicLabel.locator("xpath=ancestor::*[@data-schema-item-id][1]");
  const hitArea = schematicContainer.locator(":scope > [data-schema-hit-area]");
  await hitArea.hover();
  await expect(schematicContainer).toHaveAttribute("data-schema-hovered", "true");
  await expect(schematicContainer).toHaveCSS("filter", /drop-shadow/);
  await hitArea.click();

  const selectedRow = page.locator("#react-hierarchy-root [aria-current='true']");
  await expect(selectedRow).toHaveAttribute("data-hierarchy-item-id", itemId!);
  await expect(selectedRow).toBeFocused();

  const circuitRow = page.locator("#react-hierarchy-root [data-hierarchy-item-id]").filter({ hasText: "Kring" }).first();
  const circuitId = await circuitRow.getAttribute("data-hierarchy-item-id");
  await circuitRow.click();
  const highlightedSymbol = page.locator(
    `#right_col_inner [data-schema-item-id="${circuitId}"][data-schema-selected="true"]`,
  ).first();
  await expect(highlightedSymbol).toBeVisible();
  await expect(highlightedSymbol).toHaveCSS("filter", /drop-shadow/);
});

test("edits a circuit property through React and updates the SVG", async ({ page }) => {
  await loadExample(page, 1);

  // Rows start collapsed; reveal a circuit through the editor search.
  await page.getByRole("searchbox", { name: "Zoeken in het schema" }).fill("Kring");
  await page.getByRole("search").getByRole("button").first().click();

  const propertiesPanel = page.locator("#react-properties-root");
  await expect(propertiesPanel.getByRole("heading", { name: "Eigenschappen" })).toBeVisible();

  await propertiesPanel.getByText("Geavanceerde instellingen").click();
  const addressField = propertiesPanel.getByLabel("Adres", { exact: true });
  await addressField.fill("Smoketest-adres");
  await addressField.blur();

  await expect(page.locator("#right_col_inner #EDS svg")).toContainText("Smoketest-adres");

  const undoButton = page.getByRole("button", { name: "Ongedaan maken" });
  await undoButton.click();
  await expect(page.locator("#right_col_inner #EDS svg")).not.toContainText("Smoketest-adres");

  await page.getByRole("toolbar", { name: "Werkruimtecommando's" })
    .getByRole("button", { name: "Opnieuw" }).click();
  await expect(page.locator("#right_col_inner #EDS svg")).toContainText("Smoketest-adres");
});

test("search reveals and selects a matching item", async ({ page }) => {
  await loadExample(page, 1);

  const searchInput = page.getByRole("searchbox", { name: "Zoeken in het schema" });
  await searchInput.fill("Lichtpunt");
  await expect(page.getByRole("search").getByRole("status")).toContainText("gevonden");

  await page.getByRole("search").getByRole("button").first().click();
  await expect(searchInput).toHaveValue("");
  await expect(page.locator("#react-hierarchy-root [aria-current='true']")).toBeVisible();
});

test("unified workspace links hierarchy items to situation-plan placements", async ({ page }) => {
  await loadExample(page, 1);

  const workspaceTabs = page.getByRole("navigation", { name: "Werkruimteweergave" });
  const hierarchy = page.getByRole("navigation", { name: "Elektrische hiërarchie" });
  await expect(workspaceTabs.getByRole("button", { name: "Eéndraadschema" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("navigation", { name: "Applicatiemenu" }).getByText("Eéndraadschema", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Applicatiemenu" }).getByText("Situatieschema", { exact: true })).toHaveCount(0);

  await page.getByRole("searchbox", { name: "Zoeken in het schema" }).fill("Lichtpunt");
  await page.getByRole("search").getByRole("button").first().click();
  await page.getByRole("navigation", { name: "Inspecteursecties" })
    .getByRole("button", { name: "Koppelingen" }).click();
  const links = page.getByRole("region", { name: "Contextinspecteur" });
  await expect(links.getByRole("button", { name: "Situatieschema · symbool plaatsen" })).toBeVisible();

  await links.getByRole("button", { name: "Situatieschema · symbool plaatsen" }).click();
  await expect(workspaceTabs.getByRole("button", { name: "Situatieschema" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Nog te plaatsen" })).toBeVisible();

  const helpDialogOk = page.getByRole("button", { name: "OK" });
  if (await helpDialogOk.isVisible()) await helpDialogOk.click();
  await expect(page.locator("#paper .box.selected")).toBeVisible();
  const placementInspector = page.getByRole("region", { name: "Eigenschappen van situatiesymbool" });
  const rotation = placementInspector.getByLabel("Rotatie (°)");
  await rotation.fill("90");
  await rotation.blur();
  await expect(rotation).toHaveValue("90");

  const selectedBox = page.locator("#paper .box.selected");
  const xPosition = placementInspector.getByLabel("X");
  const yPosition = placementInspector.getByLabel("Y");
  const beforeDrag = {
    x: Number(await xPosition.inputValue()),
    y: Number(await yPosition.inputValue()),
  };
  const bounds = await selectedBox.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2 + 24, bounds!.y + bounds!.height / 2 + 16);
  await page.mouse.up();
  await expect.poll(async () => Number(await xPosition.inputValue())).toBeGreaterThan(beforeDrag.x);
  await expect.poll(async () => Number(await yPosition.inputValue())).toBeGreaterThan(beforeDrag.y);
  const afterDrag = {
    x: Number(await xPosition.inputValue()),
    y: Number(await yPosition.inputValue()),
  };
  if (await helpDialogOk.isVisible()) await helpDialogOk.click();

  const commandBar = page.getByRole("toolbar", { name: "Werkruimtecommando's" });
  await commandBar.getByRole("button", { name: "Ongedaan", exact: true }).click();
  await expect.poll(async () => Number(await xPosition.inputValue())).toBe(beforeDrag.x);
  await expect.poll(async () => Number(await yPosition.inputValue())).toBe(beforeDrag.y);

  await commandBar.getByRole("button", { name: "Opnieuw", exact: true }).click();
  await expect.poll(async () => Number(await xPosition.inputValue())).toBe(afterDrag.x);
  await expect.poll(async () => Number(await yPosition.inputValue())).toBe(afterDrag.y);
});

test("adds a secondary board, shows breadcrumbs, and deletes it again", async ({ page }) => {
  await loadExample(page, 1);

  await page.getByText("+ Verdeelbord toevoegen").click();
  const boardNavigator = page.getByRole("region", { name: "Verdeelborden" });
  const addForm = boardNavigator.locator("details").filter({ hasText: "+ Verdeelbord toevoegen" }).locator("form");
  await addForm.getByLabel("Naam").fill("Garage");
  await addForm.locator("select").selectOption({ index: 1 });
  await addForm.getByRole("button", { name: "Verdeelbord toevoegen" }).click();

  await expect(boardNavigator.getByRole("list").first()).toContainText("Garage");
  const breadcrumbs = page.getByRole("navigation", { name: /Voedingspad/ });
  await expect(breadcrumbs).toContainText("Hoofdbord");
  await expect(breadcrumbs).toContainText("Garage");

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByText("Instellingen van Garage").click();
  await page.getByRole("button", { name: "Verdeelbord verwijderen" }).click();
  await expect(boardNavigator.getByRole("list").first()).not.toContainText("Garage");
});

test("status bar zoom controls scale the SVG preview", async ({ page }) => {
  await loadExample(page, 0);

  const statusbar = page.getByRole("contentinfo", { name: "Statusbalk van de editor" });
  await statusbar.getByRole("button", { name: "Inzoomen" }).click();
  await expect(statusbar.getByRole("button", { name: "Zoom terugzetten naar 100 procent" })).toHaveText("125%");
  await expect(page.locator("#right_col_inner")).toHaveCSS("zoom", "1.25");

  await statusbar.getByRole("button", { name: "Zoom terugzetten naar 100 procent" }).click();
  await expect(statusbar.getByRole("button", { name: "Zoom terugzetten naar 100 procent" })).toHaveText("100%");
});

test("situation plan React controls manage pages", async ({ page }) => {
  await loadExample(page, 0);
  await page.getByRole("navigation", { name: "Werkruimteweergave" })
    .getByRole("button", { name: "Situatieschema" }).click();
  await expect(page.locator("#ribbon")).toBeHidden();
  await expect(page.getByRole("toolbar", { name: "Werkruimtecommando's" })).toBeVisible();
  const helpDialogOk = page.getByRole("button", { name: "OK" });
  if (await helpDialogOk.isVisible()) await helpDialogOk.click();

  const controls = page.getByRole("toolbar", { name: "Werkruimtecommando's" });
  const pageSelect = controls.getByRole("combobox", { name: "Pagina" });
  await expect(pageSelect).toHaveValue("1");

  const paper = page.locator("#paper");
  const initialElementCount = await paper.locator(".box").count();
  await controls.getByLabel("Kies een plattegrondbestand").setInputFiles("css/bg.jpg");
  await expect(paper.locator(".box")).toHaveCount(initialElementCount + 1);
  await expect(controls.getByText("De plattegrond is toegevoegd", { exact: false })).toBeAttached();

  await controls.getByRole("button", { name: "Los symbool" }).click();
  const symbolDialog = page.getByRole("dialog", { name: "Los symbool toevoegen" });
  await symbolDialog.getByLabel("Schaal (%)").fill("125");
  await symbolDialog.getByLabel("Rotatie (°)").fill("90");
  await symbolDialog.getByRole("button", { name: "Toevoegen" }).click();
  await expect(symbolDialog).toBeHidden();
  await expect(paper.locator(".box")).toHaveCount(initialElementCount + 2);

  await controls.getByRole("button", { name: "Passend" }).click();
  await expect.poll(() => paper.evaluate((element) => element.style.transform)).toMatch(/^scale\([\d.]+\)$/);
  const fittedTransform = await paper.evaluate((element) => element.style.transform);
  await controls.getByRole("button", { name: "Situatieschema inzoomen" }).click();
  await expect.poll(() => paper.evaluate((element) => element.style.transform)).not.toBe(fittedTransform);
  await controls.getByRole("button", { name: "Passend" }).click();
  await expect.poll(() => paper.evaluate((element) => element.style.transform)).toBe(fittedTransform);

  await controls.getByRole("button", { name: /^Pagina$/ }).click();
  await expect(pageSelect).toHaveValue("2");
  await expect(pageSelect.locator("option")).toHaveCount(2);

  await pageSelect.selectOption("1");
  await expect(controls.getByRole("button", { name: /^Pagina$/ })).toBeDisabled();

  await pageSelect.selectOption("2");
  page.once("dialog", (dialog) => dialog.accept());
  await controls.getByRole("button", { name: "Pagina 2 verwijderen" }).click();
  await expect(pageSelect).toHaveValue("1");
  await expect(pageSelect.locator("option")).toHaveCount(1);
});

test("print page renders a preview through the print adapter", async ({ page }) => {
  await loadExample(page, 1);

  await page.getByRole("navigation", { name: "Applicatiemenu" }).getByRole("button", { name: "Print" }).click();
  const printDialog = page.getByRole("dialog", { name: "Afdrukken" });
  await expect(printDialog).toBeVisible();
  await expect(printDialog.getByRole("button", { name: "PDF genereren" })).toBeVisible();
  await expect(printDialog.locator('[aria-label="Afdrukvoorbeeld"] > div > svg')).toBeVisible();
  await page.getByRole("button", { name: "Sluiten" }).click();

  await page.getByRole("navigation", { name: "Werkruimteweergave" })
    .getByRole("button", { name: "Eéndraadschema" }).click();
  await expect(page.getByRole("navigation", { name: "Elektrische hiërarchie" })).toBeVisible();
});
