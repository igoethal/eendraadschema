import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HelpDialog } from "../ui/workspace/HelpDialog";

afterEach(cleanup);

describe("HelpDialog", () => {
  it("offers both manuals as safe external links", () => {
    render(<HelpDialog kind="documentation" onClose={() => {}} />);

    const manualLinks = screen.getAllByRole("link", { name: "Open handleiding" });
    expect(manualLinks[0]).toHaveAttribute(
      "href",
      "Documentation/edsdoc.pdf",
    );
    expect(manualLinks[1]).toHaveAttribute(
      "href",
      "Documentation/sitplandoc.pdf",
    );
  });

  it("shows contact information and closes through the shared dialog action", () => {
    const onClose = vi.fn();
    render(<HelpDialog kind="about" onClose={onClose} />);

    expect(screen.getByRole("link", { name: "Open de online versie" })).toHaveAttribute(
      "href",
      "https://eendraadschema.goethals-jacobs.be",
    );
    fireEvent.click(screen.getByRole("button", { name: "Sluiten" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
