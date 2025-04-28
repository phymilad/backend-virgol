export function makeObjectClean<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
  ) as Partial<T>;
}

export function removeSlashPublicFromPath(path: string): string {
    return path.slice(7)
}

export const createSlug = (str: string): string => {
    return str.replace(/[<>ءأإؤۀَُُِّـ«»:"ًٌٍ،؛,!@#$%^&*)(__)]/g, '').replace(/[\s]+/g, '-')
}

export const randomId = () => Math.random().toString(36).slice(2, 10)