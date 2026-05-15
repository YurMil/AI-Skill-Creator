import { SkillPackage } from '../types';

const DB_NAME = 'ai-skill-hub-local';
const DB_VERSION = 1;
const STORE_NAME = 'packages';

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async <T>(mode: IDBTransactionMode, handler: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = handler(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const saveDraft = async (pkg: SkillPackage) =>
  withStore('readwrite', (store) => store.put({ ...pkg, updatedAt: new Date().toISOString() }));

export const loadDraft = async (id: string) =>
  withStore<SkillPackage | undefined>('readonly', (store) => store.get(id) as IDBRequest<SkillPackage | undefined>);

export const listWorkspacePackages = async () =>
  withStore<SkillPackage[]>('readonly', (store) => store.getAll() as IDBRequest<SkillPackage[]>);

export const deletePackage = async (id: string) =>
  withStore('readwrite', (store) => store.delete(id));

export const exportWorkspaceBackup = async () => {
  const packages = await listWorkspacePackages();
  return new Blob(
    [
      JSON.stringify(
        {
          schema: 'ai-skill-hub-workspace-backup-v1',
          exportedAt: new Date().toISOString(),
          packages,
        },
        null,
        2,
      ),
    ],
    { type: 'application/json' },
  );
};

export const importWorkspaceBackup = async (file: File) => {
  const text = await file.text();
  const parsed = JSON.parse(text) as { schema: string; packages: SkillPackage[] };
  if (parsed.schema !== 'ai-skill-hub-workspace-backup-v1' || !Array.isArray(parsed.packages)) {
    throw new Error('Unsupported workspace backup format.');
  }
  await Promise.all(parsed.packages.map((pkg) => saveDraft({ ...pkg, source: 'backup' })));
  return parsed.packages.length;
};
