import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { SchematicRenderStore } from "../application/SchematicRenderStore";
import { SchematicViewport } from "../ui/schematic/SchematicViewport";

afterEach(cleanup);

describe("SchematicViewport", () => {
  it("renders React-owned guidance and legend around renderer-owned SVG", () => {
    const snapshot = Object.freeze({
      revision: 0,
      svg: '<svg id="EDSSVG"><text>Testkring</text></svg>',
    });
    const renderStore: SchematicRenderStore = {
      getSnapshot: () => snapshot,
      subscribe: () => () => {},
      refresh: () => {},
    };

    const { container } = render(
      <SchematicViewport renderStore={renderStore} buildDate="2026-08-17" />,
    );

    expect(screen.getByRole("region", { name: "Eéndraadschema" })).toHaveTextContent("Testkring");
    expect(screen.getByRole("complementary", { name: "Legende van het eendraadschema" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Voorwaarden" })).toHaveAttribute("href", "license.html");
    expect(container.querySelector("#EDSSVG")).not.toBeNull();
    expect(screen.getByText(/2026-08-17/)).toBeVisible();
  });
});
