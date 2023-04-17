import _path from 'node:path'
import _ from 'lodash'

import { Payload, ServiceMethods, Strategy, FileSystem } from '../../declarations.js'
import { createCompletion } from '../../config/openai.js'
import { getExtFromFilename } from '../../utils.js'

import { secondChunkPrompt } from './function-generation.template.js'

import { DirectoryService } from '../../services/directory.service.js'
import { FileService } from '../../services/file.service.js'

type ResourceServiceMethods = ServiceMethods<Partial<FileSystem>, FileSystem>

export class FunctionGenerationStrategy implements Strategy {
  constructor (
    private fileService: ResourceServiceMethods = new FileService(),
    private dirService: ResourceServiceMethods = new DirectoryService()
  ) {}

  async execute (data: Omit<Payload, 'command' | 'inputPath'>): Promise<FileSystem> {
    const { outputPath: outPath, description: firstChunkPrompt, writeMode } = data || {}

    const outFullpath = _path.resolve(outPath)

    const { dir: outDir, ext } = _path.parse(outFullpath)

    const language = getExtFromFilename(ext)

    const chunksPrompts = [firstChunkPrompt, secondChunkPrompt]

    const tmplPrompt = chunksPrompts.join('\n\n')

    const compiled = _.template(tmplPrompt, { interpolate: /{{([\s\S]+?)}}/g })

    const prompt = compiled({ language })

    const completion = await createCompletion({ prompt })

    const outContent = completion?.text as string

    if (!(await this.dirService.get(outDir))) {
      await this.dirService.create({ path: outDir })
    }

    return this.fileService.create({
      path: outFullpath,
      content: outContent
    })
  }
}
