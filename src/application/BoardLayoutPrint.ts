import type { Hierarchical_List } from "../Hierarchical_List";

export interface BoardPrintPage { readonly svg: string; readonly sizex: number; readonly sizey: number; readonly name: string; }

export function createBoardLayoutPrintPages(document: Hierarchical_List): readonly BoardPrintPage[] {
  return document.boards.map((board) => {
    const layout = document.boardLayouts.find(candidate => candidate.boardId === board.id);
    const rails = layout?.rails ?? [];
    const width = Math.max(900, ...rails.map(rail => rail.moduleCapacity * 48 + 100));
    const height = Math.max(220, rails.length * 120 + 120);
    const content = rails.map((rail, railIndex) => {
      const y = 80 + railIndex * 120;
      const modules = Array.from({ length: rail.moduleCapacity }, (_, index) => `<rect x="${50 + index * 48}" y="${y}" width="48" height="72" fill="#fff" stroke="#9ca3af"/><text x="${74 + index * 48}" y="${y + 66}" font-size="10" text-anchor="middle">${index + 1}</text>`).join("");
      const placements = (layout?.placements ?? []).filter(placement => placement.railId === rail.id).map((placement) => {
        const item = document.getElectroItemById(placement.itemId);
        const label = escapeXml(item?.getType() ?? `Item ${placement.itemId}`);
        return `<rect x="${51 + placement.startModule * 48}" y="${y + 6}" width="${placement.moduleWidth * 48 - 2}" height="52" rx="3" fill="#dbeafe" stroke="#1d4ed8"/><text x="${51 + placement.startModule * 48 + 4}" y="${y + 28}" font-size="11">${label}</text><text x="${51 + placement.startModule * 48 + 4}" y="${y + 44}" font-size="9">${placement.moduleWidth}M</text>`;
      }).join("");
      return `<text x="20" y="${y + 32}" font-size="14" font-weight="bold">${escapeXml(rail.name)}</text>${modules}${placements}`;
    }).join("");
    return Object.freeze({
      name: `Bordindeling — ${board.name}`,
      sizex: width,
      sizey: height,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/><text x="20" y="36" font-family="Arial" font-size="24" font-weight="bold">Bordindeling — ${escapeXml(board.name)}</text>${content || '<text x="20" y="90" font-family="Arial" font-size="16">Geen bordrijen geconfigureerd.</text>'}</svg>`,
    });
  });
}
function escapeXml(value: string): string { return value.replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!); }
