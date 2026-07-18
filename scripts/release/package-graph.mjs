import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const releaseLevels = [
  ['@yok-ui/themes', '@yok-ui/hooks', '@yok-ui/icons', '@yok-ui/resolver'],
  ['@yok-ui/core'],
  ['@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand']
]

export const releasePackageNames = releaseLevels.flat()

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const dependencyFields = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]
const levelByPackageName = new Map(
  releaseLevels.flatMap((packageNames, level) => packageNames.map((packageName) => [packageName, level]))
)

async function loadPackageManifest(name, level) {
  const directory = name.replace('@yok-ui/', '')
  const packageDir = resolve(workspaceRoot, 'packages', directory)
  const manifestPath = resolve(packageDir, 'package.json')
  let manifest

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)

    throw new Error(`Failed to load release package ${name} manifest at ${manifestPath}: ${reason}`)
  }

  if (manifest.name !== name) {
    throw new Error(
      `Release package ${name} manifest at ${manifestPath} declares unexpected name ${String(manifest.name)}`
    )
  }

  return {
    name,
    directory,
    packageDir,
    manifestPath,
    manifest,
    level
  }
}

function validateInternalDependencies(releasePackages) {
  for (const releasePackage of releasePackages) {
    for (const field of dependencyFields) {
      for (const dependencyName of Object.keys(releasePackage.manifest[field] ?? {})) {
        if (!dependencyName.startsWith('@yok-ui/')) {
          continue
        }

        const dependencyLevel = levelByPackageName.get(dependencyName)

        if (dependencyLevel === undefined) {
          throw new Error(
            `${releasePackage.name} ${field} references unknown internal package ${dependencyName}`
          )
        }

        if (dependencyLevel >= releasePackage.level) {
          throw new Error(
            `${releasePackage.name} ${field} dependency ${dependencyName} must be in a previous release level ` +
            `(package level ${releasePackage.level}, dependency level ${dependencyLevel})`
          )
        }
      }
    }
  }
}

export async function loadReleasePackages() {
  const releasePackages = await Promise.all(
    releaseLevels.flatMap((packageNames, level) =>
      packageNames.map((packageName) => loadPackageManifest(packageName, level))
    )
  )

  validateInternalDependencies(releasePackages)

  return releasePackages
}
