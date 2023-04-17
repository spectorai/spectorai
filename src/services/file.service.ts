import { appendFile, readFile, stat, writeFile } from 'fs/promises'
import _path from 'node:path'

import { Query, ServiceMethods, FileSystem } from '../declarations.js'
import { getExtFromFilename, hasPathAccess } from '../utils.js'
import { ENCODING } from '../config/constants.js'

export class FileService implements ServiceMethods<Partial<FileSystem>, FileSystem> {
  async create (data: Partial<FileSystem>, query: Query = {}): Promise<FileSystem> {
    const { path: filePath, content, encoding = ENCODING } = data as any

    const { mode = 'append' } = query || {}

    const fullpath = _path.resolve(filePath)

    mode === 'overwrite'
      ? await writeFile(fullpath, content, encoding)
      : await appendFile(fullpath, content, encoding)

    return this.get(fullpath) as Promise<FileSystem>
  }

  async get (path: string, query: Query = {}): Promise<FileSystem | null> {
    const { encoding = ENCODING } = query as any || {}

    const fullpath = _path.resolve(path)

    if (!(await hasPathAccess(fullpath))) return null

    const { ext, base: filename, dir } = _path.parse(fullpath)

    const statFile = await stat(fullpath)

    if (statFile.isDirectory()) return null

    const content = await readFile(fullpath, { encoding: encoding as BufferEncoding })

    return {
      name: filename,
      ext: getExtFromFilename(ext),
      dir,
      path: fullpath,
      content,
      type: 'file',
      size: statFile.size,
      createdAt: statFile.birthtime,
      updatedAt: statFile.mtime
    }
  }
}
