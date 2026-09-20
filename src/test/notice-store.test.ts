import { describe, expect, it, vi } from "vitest";
import { LocalNoticeStore, type NoticeStorage } from "../application/NoticeStore";

function createStorage(): NoticeStorage & { values: Map<string, unknown> } {
  const values = new Map<string, unknown>();
  return {
    values,
    get: key => values.get(key),
    set: (key, value) => { values.set(key, value); },
  };
}

describe("LocalNoticeStore", () => {
  it("publishes one notice at a time and queues distinct notices", async () => {
    const store = new LocalNoticeStore(createStorage());
    const listener = vi.fn();
    store.subscribe(listener);
    const first = store.commands.show({ key: "first", title: "Eerste", paragraphs: ["Een"] });
    const second = store.commands.show({ key: "second", title: "Tweede", paragraphs: ["Twee"] });

    expect(store.getSnapshot().activeNotice?.key).toBe("first");
    store.commands.resolve("ok");
    await expect(first).resolves.toBe("ok");
    expect(store.getSnapshot().activeNotice?.key).toBe("second");
    store.commands.resolve("continue");
    await expect(second).resolves.toBe("continue");
    expect(store.getSnapshot().activeNotice).toBeNull();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("remembers dismissed helper notices without blocking decision dialogs", async () => {
    const storage = createStorage();
    const store = new LocalNoticeStore(storage);
    const first = store.commands.show({
      key: "intro",
      title: "Intro",
      paragraphs: ["Uitleg"],
      remember: {},
    });
    store.commands.resolve("ok", true);
    await first;

    await expect(store.commands.show({
      key: "intro",
      title: "Intro",
      paragraphs: ["Uitleg"],
      remember: {},
    })).resolves.toBe("ok");
    expect(store.getSnapshot().activeNotice).toBeNull();

    void store.commands.show({
      key: "choice",
      title: "Keuze",
      paragraphs: ["Kies"],
      actions: [{ id: "keep", label: "Behouden" }],
    });
    expect(store.getSnapshot().activeNotice?.key).toBe("choice");
  });

  it("shares a pending decision when Strict Mode requests it twice", async () => {
    const store = new LocalNoticeStore(createStorage());
    const request = {
      key: "legacy-choice",
      title: "Kiezen",
      paragraphs: ["Maak een keuze"],
      actions: [{ id: "keep", label: "Behouden" }, { id: "drop", label: "Vernieuwen" }],
    } as const;
    const first = store.commands.show(request);
    const duplicate = store.commands.show(request);

    expect(duplicate).toBe(first);
    store.commands.resolve("drop");
    await expect(first).resolves.toBe("drop");
    await expect(duplicate).resolves.toBe("drop");
  });
});
