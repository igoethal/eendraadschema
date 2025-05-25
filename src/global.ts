globalThis.session = new Session();
globalThis.appDocStorage = new MultiLevelStorage<any>('appDocStorage', {});
globalThis.undostruct = new undoRedo(100);
globalThis.structure = null;

