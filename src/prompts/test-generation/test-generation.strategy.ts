import path from 'node:path'

import { Payload, FileSystem, ServiceMethods, Strategy } from '../../declarations.js'
import { createCompletion } from '../../config/openai.js'

import { generateTestPrompt } from './test-generation.template.js'

import { DirectoryService } from '../../services/directory.service.js'
import { FileService } from '../../services/file.service.js'

type ResourceServiceMethods = ServiceMethods<Partial<FileSystem>, FileSystem>

export class TestGenerationStrategy implements Strategy {
  constructor (
    private fileService: ResourceServiceMethods = new FileService(),
    private dirService: ResourceServiceMethods = new DirectoryService()
  ) {}

  async execute(data: Omit<Payload, 'command'>): Promise<FileSystem> {
    const { description, inputPath, outputPath, writeMode = 'overwrite' } = data

    const inFile = await this.fileService.get(inputPath) as FileSystem
  
    const prompt = generateTestPrompt({
      language: inFile.ext as string,
      inCode: inFile.content as string,
      inPath: inputPath,
      outPath: outputPath,
      description
    })
  
    const outFullpath = path.resolve(outputPath)
  
    const completion = await createCompletion({ prompt })
  
    const outContent = completion?.text as string
  
    const { dir: outputDir } = path.parse(outFullpath)
  
    if (!(await this.dirService.get(outputDir))) {
      await this.dirService.create({ path: outputDir })
    }
  
    return this.fileService.create(
      {
        path: outFullpath,
        content: outContent
      },
      {
        mode: writeMode
      }
    )
  }
}
