import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Hierarchical_List } from "../Hierarchical_List";
import { decodeEds, structureFromJson } from "../legacy/persistence/EdsCodec";

export function loadFixture(name: string): Hierarchical_List {
  const path = resolve(process.cwd(), "examples", name);
  const encoded = readFileSync(path, "utf8");
  const decoded = decodeEds(encoded);
  return structureFromJson(decoded.text, null, decoded.version);
}

export function loadCurrentFixture(name: string): Hierarchical_List {
  const path = resolve(process.cwd(), "src", "test", "fixtures", name);
  const encoded = readFileSync(path, "utf8").trim();
  const decoded = decodeEds(encoded);
  return structureFromJson(decoded.text, null, decoded.version);
}

export function hierarchySnapshot(structure: Hierarchical_List) {
  return structure.data.map((item, ordinal) => ({
    active: structure.active[ordinal],
    id: structure.id[ordinal],
    itemId: item.id,
    parent: item.parent,
    indent: item.indent,
    collapsed: item.collapsed,
    type: item.props.type,
    props: item.props,
  }));
}
