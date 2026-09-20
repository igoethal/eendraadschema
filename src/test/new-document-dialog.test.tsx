import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NewDocumentDialog } from "../ui/workspace/NewDocumentDialog";

afterEach(cleanup);

describe("NewDocumentDialog", () => {
  it("creates an empty dossier with the selected electrical basics", () => {
    const onCreateEmpty = vi.fn();
    const onClose = vi.fn();
    render(
      <NewDocumentDialog
        onLoadExample={() => {}}
        onCreateEmpty={onCreateEmpty}
        onOpen={() => {}}
        onClose={onClose}
      />,
    );

    fireEvent.change(screen.getByLabelText("Fasen"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Hoofdzekering (A)"), { target: { value: "40" } });
    fireEvent.change(screen.getByLabelText("Hoofddifferentieel (mA)"), { target: { value: "300" } });
    fireEvent.click(screen.getByRole("button", { name: "Start met een leeg schema" }));

    expect(onCreateEmpty).toHaveBeenCalledWith({
      phaseCount: 4,
      mainBreakerAmperage: 40,
      mainDifferentialMilliamps: 300,
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("loads a chosen example and closes", () => {
    const onLoadExample = vi.fn();
    const onClose = vi.fn();
    render(
      <NewDocumentDialog
        onLoadExample={onLoadExample}
        onCreateEmpty={() => {}}
        onOpen={() => {}}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start met voorbeeld 2" }));

    expect(onLoadExample).toHaveBeenCalledWith(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("allows clearing numeric drafts and blocks invalid document creation", () => {
    const onCreateEmpty = vi.fn();
    render(
      <NewDocumentDialog
        onLoadExample={() => {}}
        onCreateEmpty={onCreateEmpty}
        onOpen={() => {}}
        onClose={() => {}}
      />,
    );

    fireEvent.change(screen.getByLabelText("Hoofdzekering (A)"), { target: { value: "" } });
    const createButton = screen.getByRole("button", { name: "Start met een leeg schema" });
    expect(screen.getByLabelText("Hoofdzekering (A)")).toHaveValue(null);
    expect(createButton).toBeDisabled();
    fireEvent.click(createButton);
    expect(onCreateEmpty).not.toHaveBeenCalled();
  });
});
