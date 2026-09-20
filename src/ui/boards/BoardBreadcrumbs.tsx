import type { EditorStore } from "../../application/EditorStore";
import type { SchemaDocumentReader } from "../../application/SchemaDocumentReader";
import type { DistributionBoard } from "../../domain/DistributionBoard";

interface BoardBreadcrumbsProps {
  readonly document: SchemaDocumentReader;
  readonly activeBoardId: string;
  readonly editorStore: EditorStore;
}

/** Feeder chain from the main board down to the active board. */
export function getBoardBreadcrumbTrail(
  document: SchemaDocumentReader,
  activeBoardId: string,
): DistributionBoard[] {
  const trail: DistributionBoard[] = [];
  const visited = new Set<string>();
  let board = document.getBoard(activeBoardId);
  while (board !== undefined && !visited.has(board.id)) {
    trail.unshift(board);
    visited.add(board.id);
    board = board.feeder === undefined ? undefined : document.getBoard(board.feeder.sourceBoardId);
  }
  return trail;
}

export function BoardBreadcrumbs({ document, activeBoardId, editorStore }: BoardBreadcrumbsProps) {
  const trail = getBoardBreadcrumbTrail(document, activeBoardId);
  if (trail.length < 2) return null;

  return (
    <nav className="mb-2" aria-label="Voedingspad van het actieve verdeelbord">
      <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
        {trail.map((board, index) => (
          <li className="flex items-center gap-1 text-sm text-neutral-500 before:content-none [&+li]:before:content-['›']" key={board.id}>
            {index < trail.length - 1 ? (
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent px-1 py-0.5 text-sm text-blue-700 underline"
                onClick={() => editorStore.commands.selectBoard(
                  board.id,
                  document.getBoard(board.id)?.rootItemIds[0] ?? null,
                )}
              >{board.name}</button>
            ) : (
              <span className="font-semibold text-neutral-900" aria-current="page">{board.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
