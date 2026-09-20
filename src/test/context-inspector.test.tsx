import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CircuitContext } from "../application/CircuitContext";
import { ContextInspector } from "../ui/workspace/ContextInspector";

afterEach(cleanup);

const context: CircuitContext = Object.freeze({
  boardId: "main",
  boardName: "Hoofdbord",
  circuitId: 2,
  circuitLabel: "Kring B",
  itemId: 3,
  itemLabel: "Lichtpunt",
  presentation: "field-device",
  situationOccurrenceIds: Object.freeze(["SP_1"]),
  hasBoardPlacement: false,
  openTaskCount: 0,
});

describe("ContextInspector", () => {
  it("returns to details after opening a linked view", () => {
    const onShowSituation = vi.fn();
    render(
      <ContextInspector
        context={context}
        issueCount={0}
        onShowSchema={() => {}}
        onShowSituation={onShowSituation}
        onShowBoard={() => {}}
        onCreateSituationOccurrence={() => {}}
        canCreateSituationOccurrence={() => true}
      >
        <p>Details van de plaatsing</p>
      </ContextInspector>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Koppelingen" }));
    fireEvent.click(screen.getByRole("button", { name: "Situatieschema · plaatsing 1" }));

    expect(onShowSituation).toHaveBeenCalledWith("SP_1");
    expect(screen.getByText("Details van de plaatsing")).toBeVisible();
    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute("aria-current", "page");
  });
});
