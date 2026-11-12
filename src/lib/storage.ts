/**
 * localStorage/sessionStorage helpers with the fault tolerance the tracker needs
 * (hardened browsers throw on access, corrupted values break JSON.parse).
 */
type ReadableStorage = Pick<Storage, "getItem">;

export function readStoredJson<T>(storage: ReadableStorage | null | undefined, key: string, fallback: T): T {
  try {
    const raw = storage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
