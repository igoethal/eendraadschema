export interface NoticeStorage {
  get(path: string): unknown;
  set(path: string, value: unknown, inMemory?: boolean): void;
}

export interface NoticeAction {
  readonly id: string;
  readonly label: string;
  readonly tone?: "primary" | "neutral";
}

export interface NoticeRequest {
  readonly key: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly link?: { readonly label: string; readonly href: string };
  readonly illustration?: "switch-symbols";
  readonly actions?: readonly NoticeAction[];
  readonly remember?: { readonly defaultChecked?: boolean };
}

export interface NoticeSnapshot {
  readonly activeNotice: NoticeRequest | null;
}

export interface NoticeCommands {
  show(request: NoticeRequest): Promise<string>;
  resolve(actionId: string, neverDisplay?: boolean): void;
}

export interface NoticeStore {
  getSnapshot(): NoticeSnapshot;
  subscribe(listener: () => void): () => void;
  readonly commands: NoticeCommands;
}

interface PendingNotice {
  readonly request: NoticeRequest;
  readonly promise: Promise<string>;
  readonly resolve: (actionId: string) => void;
}

export class LocalNoticeStore implements NoticeStore {
  private readonly listeners = new Set<() => void>();
  private readonly queue: PendingNotice[] = [];
  private active: PendingNotice | null = null;
  private snapshot: NoticeSnapshot = Object.freeze({ activeNotice: null });

  readonly commands: NoticeCommands = Object.freeze({
    show: this.show.bind(this),
    resolve: this.resolve.bind(this),
  });

  constructor(
    private readonly storage: NoticeStorage,
    private readonly storagePrefix = "helpertip",
  ) {}

  getSnapshot(): NoticeSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private show(request: NoticeRequest): Promise<string> {
    const defaultAction = request.actions?.[0]?.id ?? "ok";
    if (request.remember && this.wasAlreadyDismissed(request.key)) {
      return Promise.resolve(defaultAction);
    }
    if (this.active?.request.key === request.key) return this.active.promise;
    const queued = this.queue.find(entry => entry.request.key === request.key);
    if (queued) return queued.promise;

    let resolveNotice: (actionId: string) => void = () => {};
    const promise = new Promise<string>(resolve => { resolveNotice = resolve; });
    this.queue.push({ request: freezeRequest(request), promise, resolve: resolveNotice });
    this.activateNext();
    return promise;
  }

  private resolve(actionId: string, neverDisplay = false): void {
    if (!this.active) return;
    const completed = this.active;
    if (completed.request.remember) {
      this.storage.set(this.storagePath(completed.request.key, "displayedInThisSession"), true, true);
      if (neverDisplay) {
        this.storage.set(this.storagePath(completed.request.key, "neverDisplay"), true);
      }
    }
    this.active = null;
    completed.resolve(actionId);
    this.activateNext();
  }

  private activateNext(): void {
    if (this.active !== null) return;
    this.active = this.queue.shift() ?? null;
    this.snapshot = Object.freeze({ activeNotice: this.active?.request ?? null });
    for (const listener of this.listeners) listener();
  }

  private wasAlreadyDismissed(key: string): boolean {
    return this.storage.get(this.storagePath(key, "neverDisplay")) === true
      || this.storage.get(this.storagePath(key, "displayedInThisSession")) === true;
  }

  private storagePath(key: string, suffix: string): string {
    return `${this.storagePrefix}.${key}.${suffix}`;
  }
}

function freezeRequest(request: NoticeRequest): NoticeRequest {
  return Object.freeze({
    ...request,
    paragraphs: Object.freeze([...request.paragraphs]),
    actions: request.actions ? Object.freeze(request.actions.map(action => Object.freeze({ ...action }))) : undefined,
    link: request.link ? Object.freeze({ ...request.link }) : undefined,
    remember: request.remember ? Object.freeze({ ...request.remember }) : undefined,
  });
}
