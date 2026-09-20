import { describe, expect, it } from "vitest";
import { Hierarchical_List, PUBLIC_ELECTRO_ITEM_TYPES } from "../Hierarchical_List";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { SchemaCommandError } from "../application/SchemaStore";
import { LegacySchemaDocumentReader } from "../application/LegacySchemaDocumentReader";
import { validateSchemaDocument } from "../application/SchemaValidation";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { flattenSVGfromString } from "../general";

function createCircuitStore() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const store = new LegacySchemaStore(structure);
  const circuitId = store.commands.addItem(board.id, "Kring");
  return { store, circuitId };
}

function expectInvalidChange(action: () => unknown) {
  expect(action).toThrowError(expect.objectContaining({
    name: "SchemaCommandError",
    code: "INVALID_CHANGE",
  } satisfies Partial<SchemaCommandError>));
}

describe("Omschakelaar", () => {
  it("registers a public switch and an internal connector with safe defaults", () => {
    const structure = new Hierarchical_List();

    const item = structure.createItem("Omschakelaar");
    const port = structure.createItem("Omschakelaarpoort");

    expect(item.getType()).toBe("Omschakelaar");
    expect(item.props).toMatchObject({
      aantal_polen: "4",
      amperage: "63",
      parent_port: "IN",
      adres: "",
    });
    expect(port.getType()).toBe("Omschakelaarpoort");
    expect(port.props).toMatchObject({ poort: "OUT1" });
    expect(PUBLIC_ELECTRO_ITEM_TYPES).toContain("Omschakelaar");
    expect(PUBLIC_ELECTRO_ITEM_TYPES).not.toContain("Omschakelaarpoort");
  });

  it.each([
    "Aansluiting",
    "Aftakdoos",
    "Domotica module (verticaal)",
    "Kring",
    "Meerdere verbruikers",
    "Omvormer",
  ])("allows a switch wherever %s allows a split", (type) => {
    const structure = new Hierarchical_List();
    const parent = structure.createItem(type);

    expect(parent.allowedChilds()).toContain("Splitsing");
    expect(parent.allowedChilds()).toContain("Omschakelaar");
  });

  it("creates all three connector ports in the same undoable revision", () => {
    const { store, circuitId } = createCircuitStore();
    const revisionBefore = store.getSnapshot().revision;

    const switchId = store.commands.addItem(circuitId, "Omschakelaar");

    const connectors = store.getSnapshot().document.getChildren(switchId);
    expect(connectors.map(connector => connector.type)).toEqual([
      "Omschakelaarpoort",
      "Omschakelaarpoort",
      "Omschakelaarpoort",
    ]);
    expect(connectors.map(connector => (
      store.getLegacyDocument().getElectroItemById(connector.id)?.props.poort
    ))).toEqual(["OUT1", "IN", "OUT2"]);
    expect(store.getSnapshot().revision).toBe(revisionBefore + 1);

    store.commands.undo();
    expect(store.getSnapshot().document.getItem(switchId)).toBeUndefined();
    expect(store.getSnapshot().document.getChildren(circuitId)).toEqual([]);
  });

  it("keeps connector rows named and protects their structure", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const connectors = store.getSnapshot().document.getChildren(switchId);
    const firstPort = connectors[0];

    expect(connectors.map(connector => connector.label)).toEqual(["OUT1", "IN", "OUT2"]);
    expect(firstPort.capabilities).toMatchObject({
      canAddChild: true,
      canInsertBefore: false,
      canDelete: false,
      canDuplicate: false,
      canMove: false,
      allowedChildTypes: ["Kring"],
      allowedItemTypes: [],
    });

    expectInvalidChange(() => store.commands.addItem(switchId, "Omschakelaarpoort"));
    expectInvalidChange(() => store.commands.deleteItem(firstPort.id));
    expectInvalidChange(() => store.commands.moveItem(firstPort.id, { targetParentId: circuitId }));
    expectInvalidChange(() => store.commands.duplicateItem(firstPort.id));
    expectInvalidChange(() => store.commands.changeItemType(firstPort.id, "Kring"));
  });

  it("exposes and updates the approved switch properties", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");

    expect(store.getSnapshot().properties.getConfiguredItem(switchId)).toMatchObject({
      type: "Omschakelaar",
      values: {
        poleCount: "4",
        amperage: "63",
        parentPort: "IN",
        address: "",
      },
    });

    store.commands.updateConfiguredItem(switchId, {
      poleCount: "2",
      amperage: "100",
      parentPort: "OUT1",
      address: "Bypass",
    });

    expect(store.getSnapshot().properties.getConfiguredItem(switchId)?.values).toMatchObject({
      poleCount: "2",
      amperage: "100",
      parentPort: "OUT1",
      address: "Bypass",
    });
    // Moving the incoming wire never renames or reorders the connectors.
    expect(store.getSnapshot().document.getChildren(switchId).map(port => port.label)).toEqual([
      "OUT1",
      "IN",
      "OUT2",
    ]);
  });

  it("keeps wired connectors untouched when the incoming-wire port changes", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const before = store.getSnapshot().document.getChildren(switchId);
    const branchId = store.commands.addItem(before[0].id, "Kring");

    store.commands.updateConfiguredItem(switchId, { parentPort: "OUT1" });

    const after = store.getSnapshot().document.getChildren(switchId);
    expect(after.map(port => [port.id, port.label])).toEqual(before.map(port => [port.id, port.label]));
    expect(store.getSnapshot().document.getChildren(before[0].id).map(child => child.id)).toEqual([branchId]);

    store.commands.undo();
    expect(store.getSnapshot().properties.getConfiguredItem(switchId)?.values.parentPort).toBe("IN");
    expect(store.getSnapshot().document.getChildren(before[0].id).map(child => child.id)).toEqual([branchId]);
  });

  it.each(["OUT1", "IN", "OUT2"])(
    "still allows an extra circuit above the connector where the incoming wire enters (%s)",
    (parentPort) => {
      const { store, circuitId } = createCircuitStore();
      const switchId = store.commands.addItem(circuitId, "Omschakelaar");
      store.commands.updateConfiguredItem(switchId, { parentPort });
      const connector = store.getSnapshot().document.getChildren(switchId)
        .find(port => port.label === parentPort)!;

      expect(connector.capabilities.canAddChild).toBe(true);
      const branchId = store.commands.addItem(connector.id, "Kring");
      expect(store.getSnapshot().document.getItem(branchId)?.parentId).toBe(connector.id);
    },
  );

  it("adds the missing connector to a document saved with only two", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const structure = store.getLegacyDocument();
    const inConnector = store.getSnapshot().document.getChildren(switchId).find(port => port.label === "IN")!;
    structure.deleteById(inConnector.id);
    expect(structure.data.filter(item => item.parent === switchId && item.props.type === "Omschakelaarpoort"))
      .toHaveLength(2);

    structure.voegAttributenToeAlsNodigEnReSort();

    const ports = structure.data
      .filter(item => item.parent === switchId && item.props.type === "Omschakelaarpoort")
      .map(item => item.props.poort)
      .sort();
    expect(ports).toEqual(["IN", "OUT1", "OUT2"]);
  });

  it.each([
    ["poleCount", "3"],
    ["amperage", "50"],
    ["parentPort", "GRID"],
  ])("rejects unsupported %s values", (key, value) => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");

    expectInvalidChange(() => store.commands.updateConfiguredItem(switchId, { [key]: value }));
  });

  it("reports malformed connector topology without crashing", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const structure = store.getLegacyDocument();
    const [firstPort, secondPort] = store.getSnapshot().document.getChildren(switchId);

    structure.getElectroItemById(secondPort.id)!.props.poort = "OUT1";
    const invalidChild = structure.createItem("Contactdoos");
    structure.insertChildAfterId(invalidChild, firstPort.id);

    const issues = validateSchemaDocument(new LegacySchemaDocumentReader(structure));
    expect(issues.map(issue => issue.code)).toEqual(expect.arrayContaining([
      "OMSCHAKELAAR_DUPLICATE_PORT",
      "OMSCHAKELAAR_INVALID_PORT_CHILD",
    ]));
  });

  it("reports a missing connector", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const structure = store.getLegacyDocument();
    const [, , lastPort] = store.getSnapshot().document.getChildren(switchId);

    structure.deleteById(lastPort.id);

    const issues = validateSchemaDocument(new LegacySchemaDocumentReader(structure));
    expect(issues.map(issue => issue.code)).toEqual(expect.arrayContaining(["OMSCHAKELAAR_PORT_COUNT"]));
  });

  it("round trips switch properties, port identities, wiring, and stable IDs", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    store.commands.updateConfiguredItem(switchId, {
      poleCount: "2",
      amperage: "80",
      address: "Victron bypass",
    });
    const portIds = store.getSnapshot().document.getChildren(switchId).map(port => port.id);
    const branchId = store.commands.addItem(portIds[1], "Kring");

    const restored = structureFromJson(store.getLegacyDocument().toJsonObject(false), null, 6);
    const restoredStore = new LegacySchemaStore(restored);

    expect(restoredStore.getSnapshot().properties.getConfiguredItem(switchId)?.values).toMatchObject({
      poleCount: "2",
      amperage: "80",
      parentPort: "IN",
      address: "Victron bypass",
    });
    expect(restoredStore.getSnapshot().document.getChildren(switchId).map(port => port.id)).toEqual(portIds);
    expect(restoredStore.getSnapshot().document.getItem(branchId)?.parentId).toBe(portIds[1]);
  });

  it("renders a vertically oriented neutral switch on a circuit", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    store.commands.updateConfiguredItem(switchId, { address: "Bypass <veilig>" });

    const svg = store.getLegacyDocument().toSVG(0, "horizontal");
    const document = new DOMParser().parseFromString(svg.data, "image/svg+xml");
    const component = document.querySelector('[data-component="omschakelaar"]');

    expect(component).not.toBeNull();
    expect(component?.getAttribute("data-position")).toBe("neutral");
    expect(component?.getAttribute("data-orientation")).toBe("vertical");
    expect(component?.querySelectorAll("[data-switch-contact]")).toHaveLength(3);
    expect(component?.querySelectorAll("[data-selector-arm]")).toHaveLength(1);
    const inputContact = component?.querySelector('[data-switch-contact="IN"]');
    const inputConductor = component?.querySelector('[data-input-conductor="IN"]');
    const rating = component?.querySelector('[data-switch-rating]');
    const address = component?.querySelector('[data-switch-address]');
    expect(inputConductor?.getAttribute("x1")).toBe(inputContact?.getAttribute("cx"));
    expect(inputConductor?.getAttribute("x2")).toBe(inputContact?.getAttribute("cx"));
    expect(inputConductor?.getAttribute("stroke-linecap")).toBe("round");
    expect(Number(rating?.getAttribute("x"))).toBeGreaterThan(Number(inputConductor?.getAttribute("x1")));
    expect(Number(address?.getAttribute("x"))).toBeGreaterThan(Number(inputConductor?.getAttribute("x1")));
    expect(rating?.getAttribute("text-anchor")).toBe("start");
    expect(address?.getAttribute("text-anchor")).toBe("start");
    expect(component?.textContent).toContain("IN");
    expect(component?.textContent).toContain("OUT1");
    expect(component?.textContent).toContain("OUT2");
    expect(component?.textContent).toContain("63A 4P");
    expect(component?.textContent).toContain("Bypass <veilig>");
    expect(svg.data).not.toContain("Bypass <veilig>");
    expect(svg.xleft + svg.xright).toBeGreaterThan(0);
    expect(svg.yup + svg.ydown).toBeGreaterThan(0);
  });

  it.each(["IN", "OUT1", "OUT2"])(
    "keeps OUT1 left, IN middle, OUT2 right and attaches the incoming wire to %s",
    (parentPort) => {
      const structure = new Hierarchical_List();
      const board = structure.addItem("Bord");
      const store = new LegacySchemaStore(structure);
      const circuitId = store.commands.addItem(board.id, "Kring");
      const switchId = store.commands.addItem(circuitId, "Omschakelaar");
      if (parentPort !== "IN") store.commands.updateConfiguredItem(switchId, { parentPort });
      for (const connector of store.getSnapshot().document.getChildren(switchId)) {
        store.commands.addItem(connector.id, "Kring");
      }

      const flattened = flattenSVGfromString(store.getLegacyDocument().toSVG(0, "horizontal").data);
      const document = new DOMParser().parseFromString(flattened, "image/svg+xml");
      const wrapper = document.querySelector(`g[data-schema-item-id="${switchId}"]`)!;
      const x = (port: string) => Number(wrapper.querySelector(`[data-switch-contact="${port}"]`)!.getAttribute("cx"));
      const input = wrapper.querySelector("[data-input-conductor]")!;
      const cableLine = wrapper.nextElementSibling!;

      expect(x("OUT1")).toBeLessThan(x("IN"));
      expect(x("IN")).toBeLessThan(x("OUT2"));
      expect(input.getAttribute("data-input-conductor")).toBe(parentPort);
      expect(Number(input.getAttribute("x1"))).toBe(x(parentPort));
      expect(Number(input.getAttribute("x1"))).toBe(Number(cableLine.getAttribute("x1")));
      // Every slot, including the one the incoming wire enters, keeps its own upward branch and insert anchor.
      for (const port of ["OUT1", "IN", "OUT2"]) {
        expect(wrapper.querySelector(`[data-output-conductor="${port}"]`)).not.toBeNull();
      }
      const anchored = Array.from(wrapper.querySelectorAll("[data-explicit-port-anchor]"))
        .map(anchor => anchor.getAttribute("data-explicit-port-anchor"))
        .sort();
      expect(anchored).toEqual(["IN", "OUT1", "OUT2"]);
    },
  );

  it.each(["IN", "OUT1", "OUT2"])(
    "keeps OUT1 top, IN middle, OUT2 bottom in horizontal mode with the incoming wire on %s",
    (parentPort) => {
      const structure = new Hierarchical_List();
      const connection = structure.addItem("Aansluiting");
      const store = new LegacySchemaStore(structure);
      const switchId = store.commands.addItem(connection.id, "Omschakelaar");
      if (parentPort !== "IN") store.commands.updateConfiguredItem(switchId, { parentPort });

      const document = new DOMParser().parseFromString(
        store.getLegacyDocument().toSVG(0, "horizontal").data,
        "image/svg+xml",
      );
      const component = document.querySelector(`svg[data-schema-item-id="${switchId}"] [data-component="omschakelaar"]`)!;
      const y = (port: string) => Number(component.querySelector(`[data-switch-contact="${port}"]`)!.getAttribute("cy"));
      const input = component.querySelector("[data-input-conductor]")!;

      expect(y("OUT1")).toBeLessThan(y("IN"));
      expect(y("IN")).toBeLessThan(y("OUT2"));
      expect(Number(input.getAttribute("y1"))).toBe(y(parentPort));
      expect(Number(input.getAttribute("y2"))).toBe(y(parentPort));
    },
  );

  it("keeps the port label clear of the rating/address text below it", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    store.commands.updateConfiguredItem(switchId, { address: "Bypass" });

    const document = new DOMParser().parseFromString(
      store.getLegacyDocument().toSVG(0, "horizontal").data,
      "image/svg+xml",
    );
    const component = document.querySelector('[data-component="omschakelaar"]')!;
    const portLabel = Array.from(component.querySelectorAll("text"))
      .find(text => text.textContent === "IN")!;
    const rating = component.querySelector('[data-switch-rating]')!;
    const address = component.querySelector('[data-switch-address]')!;

    // The rating/address labels must sit strictly below the port label, on
    // their own separate lines, so long text like "63A 4P" never collides
    // with the "IN"/"OUT1"/"OUT2" port labels.
    expect(Number(rating.getAttribute("y"))).toBeGreaterThan(Number(portLabel.getAttribute("y")) + 8);
    expect(Number(address.getAttribute("y"))).toBeGreaterThan(Number(rating.getAttribute("y")) + 8);
  });

  it("renders no independent conductor for structural port nodes", () => {
    const structure = new Hierarchical_List();
    const port = structure.createItem("Omschakelaarpoort");

    const svg = port.toSVG();

    expect(svg.data).toBe("");
    expect(svg.xleft + svg.xright).toBe(0);
    expect(svg.yup + svg.ydown).toBe(0);
  });

  it("keeps both wired outputs continuous with no duplicate port segments", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    for (const port of store.getSnapshot().document.getChildren(switchId)) {
      store.commands.addItem(port.id, "Kring");
    }

    const document = new DOMParser().parseFromString(
      store.getLegacyDocument().toSVG(0, "horizontal").data,
      "image/svg+xml",
    );
    const component = document.querySelector('[data-component="omschakelaar"]')!;

    expect(component.querySelectorAll('[data-port-placeholder]')).toHaveLength(0);
    for (const port of ["OUT1", "OUT2"]) {
      const contact = component.querySelector(`[data-switch-contact="${port}"]`)!;
      const conductor = component.querySelector(`[data-output-conductor="${port}"]`)!;
      const branch = component.querySelector(`[data-branch-origin="${port}"]`)!;
      const anchor = component.querySelector(`[data-explicit-port-anchor="${port}"]`)!;
      expect(conductor.getAttribute("x1")).toBe(contact.getAttribute("cx"));
      expect(conductor.getAttribute("y1")).toBe(contact.getAttribute("cy"));
      expect(conductor.getAttribute("stroke-linecap")).toBe("round");
      expect(branch.getAttribute("data-x")).toBe(conductor.getAttribute("x2"));
      expect(branch.getAttribute("data-y")).toBe(conductor.getAttribute("y2"));
      expect(anchor.getAttribute("data-schema-end-x")).toBe(conductor.getAttribute("x2"));
      expect(anchor.getAttribute("data-schema-anchor-y")).toBe(conductor.getAttribute("y2"));
    }
  });

  it("renders horizontal geometry when the incoming conductor is not a circuit branch", () => {
    const structure = new Hierarchical_List();
    const connection = structure.addItem("Aansluiting");
    const store = new LegacySchemaStore(structure);
    const switchId = store.commands.addItem(connection.id, "Omschakelaar");
    const document = new DOMParser().parseFromString(
      store.getLegacyDocument().toSVG(0, "horizontal").data,
      "image/svg+xml",
    );
    const component = document.querySelector('[data-component="omschakelaar"]')!;
    const input = component.querySelector('[data-switch-contact="IN"]')!;
    const out1 = component.querySelector('[data-switch-contact="OUT1"]')!;
    const out2 = component.querySelector('[data-switch-contact="OUT2"]')!;

    expect(component.getAttribute("data-orientation")).toBe("horizontal");
    expect(Number(input.getAttribute("cx"))).toBeLessThan(Number(out1.getAttribute("cx")));
    expect(Number(out1.getAttribute("cy"))).toBeLessThan(Number(out2.getAttribute("cy")));
  });

  it("joins the vertical input wire at the switch wrapper boundary", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const document = new DOMParser().parseFromString(
      store.getLegacyDocument().toSVG(0, "horizontal").data,
      "image/svg+xml",
    );
    const wrapper = document.querySelector(`svg[data-schema-item-id="${switchId}"]`)!;
    const component = wrapper.querySelector('[data-component="omschakelaar"]')!;
    const inputConductor = component.querySelector('[data-input-conductor="IN"]')!;
    const parentWrapper = wrapper.parentElement!;
    const parentLine = Array.from(parentWrapper.querySelectorAll(":scope > line"))
      .find(line => line.getAttribute("y1") === wrapper.getAttribute("data-schema-height"))!;

    expect(Number(inputConductor.getAttribute("x1"))).toBe(Number(inputConductor.getAttribute("x2")));
    expect(Number(inputConductor.getAttribute("y1"))).toBe(Number(wrapper.getAttribute("data-schema-height")));
    expect(Number(inputConductor.getAttribute("x1")) + Number(wrapper.getAttribute("x")))
      .toBe(Number(parentLine.getAttribute("x1")));
  });

  it("keeps the vertical input axis aligned after live-preview SVG flattening", () => {
    // The React preview does not render raw toSVG() output: SchematicRenderStore
    // runs it through flattenSVGfromString first. That flattener only recurses
    // into <svg> wrappers to propagate accumulated x/y shifts; a component that
    // wraps its own drawing in a <g> (as Omschakelaar does) must still end up
    // shifted the same way as its ancestors' plain <line> elements.
    const structure = new Hierarchical_List();
    const connection = structure.addItem("Aansluiting");
    const store = new LegacySchemaStore(structure);
    const circuitId = store.commands.addItem(connection.id, "Kring");
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");

    const flattened = flattenSVGfromString(store.getLegacyDocument().toSVG(0, "horizontal").data);
    const document = new DOMParser().parseFromString(flattened, "image/svg+xml");
    const wrapper = document.querySelector(`g[data-schema-item-id="${switchId}"]`)!;
    const inputConductor = wrapper.querySelector('[data-input-conductor="IN"]')!;
    const cableLine = wrapper.nextElementSibling!;

    expect(cableLine.tagName.toLowerCase()).toBe("line");
    expect(Number(inputConductor.getAttribute("x1"))).toBe(Number(cableLine.getAttribute("x1")));
  });

  it("uses pixel-aligned axes when both vertical outputs are wired", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    for (const port of store.getSnapshot().document.getChildren(switchId)) {
      store.commands.addItem(port.id, "Kring");
    }
    const document = new DOMParser().parseFromString(
      store.getLegacyDocument().toSVG(0, "horizontal").data,
      "image/svg+xml",
    );
    const component = document.querySelector('[data-component="omschakelaar"]')!;
    for (const selector of [
      '[data-switch-contact="IN"]',
      '[data-switch-contact="OUT1"]',
      '[data-switch-contact="OUT2"]',
    ]) {
      const contact = component.querySelector(selector)!;
      expect(Number(contact.getAttribute("cx")) % 1).toBe(0);
      expect(Number(contact.getAttribute("cy")) % 1).toBe(0);
    }
  });

  it("keeps the input axis aligned when the circuit has a preceding sibling", () => {
    const { store, circuitId } = createCircuitStore();
    store.commands.addItem(circuitId, "Contactdoos");
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const document = new DOMParser().parseFromString(
      store.getLegacyDocument().toSVG(0, "horizontal").data,
      "image/svg+xml",
    );
    const wrapper = document.querySelector(`svg[data-schema-item-id="${switchId}"]`)!;
    const component = wrapper.querySelector('[data-component="omschakelaar"]')!;
    const inputConductor = component.querySelector('[data-input-conductor="IN"]')!;
    const parentWrapper = wrapper.parentElement!;
    const parentLine = Array.from(parentWrapper.querySelectorAll(":scope > line"))
      .find(line => line.getAttribute("y1") === String(
        Number(wrapper.getAttribute("y")) + Number(wrapper.getAttribute("data-schema-height")),
      ))!;

    expect(Number(inputConductor.getAttribute("x1")) + Number(wrapper.getAttribute("x")))
      .toBe(Number(parentLine.getAttribute("x1")));
  });

  it("creates an unprotected connection circuit below a physical port", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const portId = store.getSnapshot().document.getChildren(switchId)[0].id;

    const branchId = store.commands.addItem(portId, "Kring");
    const branch = store.getLegacyDocument().getElectroItemById(branchId)!;

    expect(branch.props.bescherming).toBe("geen");
    expect(branch.props.kabel_is_aanwezig).toBe(false);
  });

  it("rejects generic type changes that would create or dismantle a compound switch", () => {
    const { store, circuitId } = createCircuitStore();
    const switchId = store.commands.addItem(circuitId, "Omschakelaar");
    const ordinaryItemId = store.commands.addItem(circuitId, "Contactdoos");

    expectInvalidChange(() => store.commands.changeItemType(switchId, "Contactdoos"));
    expectInvalidChange(() => store.commands.changeItemType(ordinaryItemId, "Omschakelaar"));
    expect(store.getSnapshot().document.getItem(switchId)?.capabilities.allowedItemTypes).toEqual([]);
  });
});
