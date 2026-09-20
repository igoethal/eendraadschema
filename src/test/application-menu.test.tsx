import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApplicationMenu } from "../ui/workspace/ApplicationMenu";

afterEach(cleanup);

describe("ApplicationMenu", () => {
  it("keeps primary document actions directly available", () => {
    const onNew = vi.fn();
    const onFile = vi.fn();
    const onPrint = vi.fn();
    render(
      <ApplicationMenu
        onNew={onNew}
        onFile={onFile}
        onPrint={onPrint}
        onDocumentation={() => {}}
        onAbout={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Nieuw" }));
    fireEvent.click(screen.getByRole("button", { name: "Bestand" }));
    fireEvent.click(screen.getByRole("button", { name: "Print" }));
    expect(onNew).toHaveBeenCalledOnce();
    expect(onFile).toHaveBeenCalledOnce();
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it("groups documentation and contact in the help dropdown", () => {
    const onDocumentation = vi.fn();
    const onAbout = vi.fn();
    render(
      <ApplicationMenu
        onNew={() => {}}
        onFile={() => {}}
        onPrint={() => {}}
        onDocumentation={onDocumentation}
        onAbout={onAbout}
      />,
    );

    const details = screen.getByText("Hulp", { exact: true }).closest("details");
    expect(details).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("Hulp", { exact: true }));
    fireEvent.click(screen.getByRole("button", { name: "Documentatie" }));
    expect(onDocumentation).toHaveBeenCalledOnce();
    expect(details).not.toHaveAttribute("open");

    fireEvent.click(screen.getByText("Hulp", { exact: true }));
    fireEvent.click(screen.getByRole("button", { name: "Info en contact" }));
    expect(onAbout).toHaveBeenCalledOnce();
  });
});
