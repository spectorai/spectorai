import { mkdir, stat } from 'node:fs/promises'
import _path from 'node:path'

import { ServiceMethods, FileSystem } from '../declarations.js'
import { hasPathAccess } from '../utils.js'

export class DirectoryService implements ServiceMethods<FileSystem, FileSystem> {
  async create (data: unknown, query: unknown = {}): Promise<FileSystem> {
    const { path = '' } = data as any || {}

    const { recursive = true } = query as any

    const fullpath = _path.resolve(path)

    await mkdir(fullpath, { recursive })

    return this.get(path) as Promise<FileSystem>
  }

  async get (path: string, query?: unknown): Promise<FileSystem | null> {
    const fullpath = _path.resolve(path)

    if (!(await hasPathAccess(fullpath))) return null

    const statEntity = await stat(fullpath)

    if (statEntity.isFile()) return null

    const { dir } = _path.parse(fullpath)

    const name = fullpath.split(_path.sep).at(-1) as string

    return {
      name,
      ext: null,
      dir,
      path: fullpath,
      type: 'dir',
      content: null,
      size: statEntity.size,
      createdAt: statEntity.birthtime,
      updatedAt: statEntity.mtime
    }
  }
}
