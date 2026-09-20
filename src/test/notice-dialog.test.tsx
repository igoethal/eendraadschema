import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalNoticeStore } from "../application/NoticeStore";
import { NoticeDialog } from "../ui/workspace/NoticeDialog";

afterEach(cleanup);

describe("NoticeDialog", () => {
  it("renders structured content and resolves the selected action", async () => {
    const values = new Map<string, unknown>();
    const store = new LocalNoticeStore({
      get: key => values.get(key),
      set: (key, value) => { values.set(key, value); },
    });
    render(<NoticeDialog store={store} />);
    const result = store.commands.show({
      key: "switches",
      title: "Weergave kiezen",
      paragraphs: ["Maak een keuze."],
      illustration: "switch-symbols",
      actions: [
        { id: "keep", label: "Behouden", tone: "neutral" },
        { id: "drop", label: "Vernieuwen", tone: "primary" },
      ],
    });

    expect(await screen.findByRole("dialog", { name: "Weergave kiezen" })).toBeVisible();
    expect(screen.getByLabelText("Schakelaarsymbool met leiding")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Vernieuwen" }));
    await expect(result).resolves.toBe("drop");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
