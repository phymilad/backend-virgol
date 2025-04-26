export function makeObjectClean<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
  ) as Partial<T>;
}

export function removeSlashPublicFromPath(path: string): string {
    return path.slice(7)
}