export interface SvgExportService {
  download(svg: string, filename: string): void;
}

export class LegacySvgExportService implements SvgExportService {
  constructor(
    private readonly downloadBlob: (content: string, filename: string, mimeType: string) => void,
  ) {}

  download(svg: string, filename: string): void {
    this.downloadBlob(svg, filename, "data:image/svg+xml;charset=utf-8");
  }
}

