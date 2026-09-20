import type { WorkspaceTab } from "./WorkspaceStore";

/**
 * Transitional rendering boundary for workspaces that still use legacy DOM or
 * canvas implementations. Navigation remains the responsibility of React and
 * WorkspaceStore; adapters may only prepare the requested view.
 */
export interface WorkspaceViewAdapter {
  prepare(tab: WorkspaceTab): void;
}

