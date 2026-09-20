import type { Hierarchical_List } from "../Hierarchical_List";

/** Owns the current legacy document while model migration is in progress. */
export interface DocumentHost {
  get(): Hierarchical_List;
  replace(document: Hierarchical_List): void;
}

export class LocalDocumentHost implements DocumentHost {
  constructor(private document: Hierarchical_List) {}

  get(): Hierarchical_List {
    return this.document;
  }

  replace(document: Hierarchical_List): void {
    this.document = document;
  }
}

