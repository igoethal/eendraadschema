export type WorkspaceHistoryScope = "schema" | "situation";

/**
 * Transitional command boundary for the two histories that coexist during
 * migration. UI code chooses a semantic scope, never a legacy implementation.
 */
export interface WorkspaceHistoryAdapter {
  undo(scope: WorkspaceHistoryScope): void;
  redo(scope: WorkspaceHistoryScope): void;
}

