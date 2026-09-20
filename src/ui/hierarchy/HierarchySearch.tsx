import { useId, useMemo, useState } from "react";
import type { EditorStore } from "../../application/EditorStore";
import type { SchemaDocumentReader } from "../../application/SchemaDocumentReader";
import { searchHierarchyItems, type HierarchySearchResult } from "./hierarchyModel";
import { ui } from "../uiStyles";

const MAX_VISIBLE_RESULTS = 20;

interface HierarchySearchProps {
  readonly document: SchemaDocumentReader;
  readonly editorStore: EditorStore;
}

function focusHierarchyItem(itemId: number): void {
  requestAnimationFrame(() => {
    const row = window.document.querySelector<HTMLButtonElement>(
      `[data-hierarchy-item-id="${itemId}"]`,
    );
    row?.scrollIntoView({ block: "nearest" });
    row?.focus();
  });
}

export function HierarchySearch({ document, editorStore }: HierarchySearchProps) {
  const [query, setQuery] = useState("");
  const resultsId = useId();
  const results = useMemo(() => searchHierarchyItems(document, query), [document, query]);
  const visibleResults = results.slice(0, MAX_VISIBLE_RESULTS);
  const hasQuery = query.trim() !== "";

  function reveal(result: HierarchySearchResult): void {
    editorStore.commands.revealItem(result.node.id, result.boardId, result.ancestorItemIds);
    setQuery("");
    focusHierarchyItem(result.node.id);
  }

  return (
    <search className="mb-3 block">
      <label>
        <span className="sr-only">Zoeken in het schema</span>
        <input
          className={ui.field}
          type="search"
          placeholder="Zoeken op naam, adres of type…"
          value={query}
          aria-controls={resultsId}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
            if (event.key === "Enter" && visibleResults.length > 0) {
              event.preventDefault();
              reveal(visibleResults[0]);
            }
          }}
        />
      </label>
      {hasQuery ? (
        <div className="mt-1 rounded-md border border-neutral-300 bg-white p-2" id={resultsId}>
          <p role="status" className="m-0 mb-1 text-sm text-neutral-500">
            {results.length === 0
              ? "Geen onderdelen gevonden."
              : `${results.length} ${results.length === 1 ? "onderdeel" : "onderdelen"} gevonden`}
          </p>
          {visibleResults.length > 0 ? (
            <ol className="m-0 list-none p-0">
              {visibleResults.map((result) => (
                <li className="border-t border-neutral-100 first:border-t-0" key={result.node.id}>
                  <button className="flex w-full cursor-pointer flex-col gap-0.5 border-0 bg-transparent px-1 py-1.5 text-left hover:bg-blue-50 focus-visible:bg-blue-50" type="button" onClick={() => reveal(result)}>
                    <span>{result.node.label}</span>
                    <small className="text-neutral-500">
                      {result.node.type}
                      {result.boardName ? ` — ${result.boardName}` : ""}
                      {result.node.summary.address ? ` — ${result.node.summary.address}` : ""}
                    </small>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
          {results.length > MAX_VISIBLE_RESULTS ? (
            <p className="m-0 mt-1 text-xs text-neutral-500">
              Enkel de eerste {MAX_VISIBLE_RESULTS} resultaten worden getoond. Verfijn de zoekopdracht.
            </p>
          ) : null}
        </div>
      ) : null}
    </search>
  );
}
