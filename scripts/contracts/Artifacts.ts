import * as path from 'path'

import { Artifact } from './Artifact'
import { findFolderPath, globPromise, fsWriteFilePromise } from './utils'

const DEFAULT_FOLDER_PATH = 'src/contracts/artifacts'

export class Artifacts {
  static PROPERTY_BLACKLIST = ['bytecode', 'sourceMap', 'deployedSourceMap', 'sourcePath', 'ast', 'compiler']

  folderPath: string
  collection: Artifact[] = []

  constructor(folderPath: string) {
    folderPath = folderPath || findFolderPath(DEFAULT_FOLDER_PATH)
    this.folderPath = folderPath
  }

  async buildCollection(): Promise<Artifact[]> {
    const paths = await this.getPaths()
    this.collection = paths.map(path => new Artifact(path))
    return this.collection
  }

  async getPaths(): Promise<string[]> {
    const artifactsPattern = path.join(this.folderPath, 'MANAToken.json')
    return globPromise(artifactsPattern)
  }

  async trim(): Promise<string[]> {
    return Promise.all(this.collection.map(artifact => artifact.trim()))
  }

  async write(): Promise<void> {
    for (const artifact of this.collection) {
      const content = await artifact.trim()
      await fsWriteFilePromise(artifact.path, content)
    }
  }
}
