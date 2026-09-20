import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { WorkspaceStore } from "../../application/WorkspaceStore";
import { useWorkspaceSnapshot } from "../useWorkspaceSnapshot";

const DEFAULT_WIDTH = 304;
const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const KEYBOARD_STEP = 24;

type SidebarSide = "left" | "right";

function clampWidth(width: number): number {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(width)));
}

export function WorkspaceSidebarResizers({ store }: { readonly store: WorkspaceStore }) {
  const { activeTab, isActive } = useWorkspaceSnapshot(store);
  const [leftWidth, setLeftWidth] = useState(DEFAULT_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_WIDTH);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const draggingSide = useRef<SidebarSide | null>(null);

  const effectiveLeftWidth = leftCollapsed ? 0 : leftWidth;
  const effectiveRightWidth = rightCollapsed ? 0 : rightWidth;

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--workspace-left-width", `${effectiveLeftWidth}px`);
    root.style.setProperty("--workspace-right-width", `${effectiveRightWidth}px`);
    return () => {
      root.style.removeProperty("--workspace-left-width");
      root.style.removeProperty("--workspace-right-width");
    };
  }, [effectiveLeftWidth, effectiveRightWidth]);

  if (!isActive || activeTab === "dossier") return null;

  function resizeFromPointer(side: SidebarSide, event: PointerEvent<HTMLDivElement>) {
    if (draggingSide.current !== side) return;
    if (side === "left") {
      setLeftCollapsed(false);
      setLeftWidth(clampWidth(event.clientX));
    } else {
      setRightCollapsed(false);
      setRightWidth(clampWidth(window.innerWidth - event.clientX));
    }
  }

  function resizeFromKeyboard(side: SidebarSide, event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") {
      if (side === "left") setLeftWidth(DEFAULT_WIDTH);
      else setRightWidth(DEFAULT_WIDTH);
      return;
    }
    const direction = event.key === "ArrowRight" ? 1 : -1;
    if (side === "left") {
      setLeftCollapsed(false);
      setLeftWidth((width) => clampWidth(width + direction * KEYBOARD_STEP));
    } else {
      setRightCollapsed(false);
      setRightWidth((width) => clampWidth(width - direction * KEYBOARD_STEP));
    }
  }

  const separatorClass = "workspace-resize-handle fixed top-[var(--total-offset)] bottom-0 z-20 w-2 cursor-col-resize bg-transparent hover:bg-blue-500/20 focus-visible:bg-blue-500/30 focus-visible:outline-none";
  const toggleClass = "workspace-resize-handle fixed top-[calc(var(--total-offset)+0.75rem)] z-30 grid size-7 place-items-center rounded-full border border-neutral-300 bg-white text-sm font-bold text-neutral-700 shadow hover:bg-neutral-100 focus-visible:outline-3 focus-visible:outline-blue-700/35";

  return (
    <>
      <div
        className={`${separatorClass} left-[calc(var(--workspace-left-width)-0.25rem)]`}
        role="separator"
        aria-label="Breedte van navigatie aanpassen"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={MAX_WIDTH}
        aria-valuenow={effectiveLeftWidth}
        tabIndex={0}
        onDoubleClick={() => { setLeftCollapsed(false); setLeftWidth(DEFAULT_WIDTH); }}
        onKeyDown={(event) => resizeFromKeyboard("left", event)}
        onPointerDown={(event) => { draggingSide.current = "left"; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => resizeFromPointer("left", event)}
        onPointerUp={() => { draggingSide.current = null; }}
        onPointerCancel={() => { draggingSide.current = null; }}
      />
      <button
        type="button"
        className={`${toggleClass} left-[calc(var(--workspace-left-width)+0.375rem)]`}
        aria-label={leftCollapsed ? "Navigatie tonen" : "Navigatie inklappen"}
        title={leftCollapsed ? "Navigatie tonen" : "Navigatie inklappen"}
        onClick={() => setLeftCollapsed((collapsed) => !collapsed)}
      >{leftCollapsed ? "›" : "‹"}</button>

      <div
        className={`${separatorClass} right-[calc(var(--workspace-right-width)-0.25rem)]`}
        role="separator"
        aria-label="Breedte van eigenschappen aanpassen"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={MAX_WIDTH}
        aria-valuenow={effectiveRightWidth}
        tabIndex={0}
        onDoubleClick={() => { setRightCollapsed(false); setRightWidth(DEFAULT_WIDTH); }}
        onKeyDown={(event) => resizeFromKeyboard("right", event)}
        onPointerDown={(event) => { draggingSide.current = "right"; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => resizeFromPointer("right", event)}
        onPointerUp={() => { draggingSide.current = null; }}
        onPointerCancel={() => { draggingSide.current = null; }}
      />
      <button
        type="button"
        className={`${toggleClass} right-[calc(var(--workspace-right-width)+0.375rem)]`}
        aria-label={rightCollapsed ? "Eigenschappen tonen" : "Eigenschappen inklappen"}
        title={rightCollapsed ? "Eigenschappen tonen" : "Eigenschappen inklappen"}
        onClick={() => setRightCollapsed((collapsed) => !collapsed)}
      >{rightCollapsed ? "‹" : "›"}</button>
    </>
  );
}
