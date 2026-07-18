import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const releaseLevels = Object.freeze([
  Object.freeze(['@yok-ui/themes', '@yok-ui/hooks', '@yok-ui/icons', '@yok-ui/resolver']),
  Object.freeze(['@yok-ui/core']),
  Object.freeze(['@yok-ui/product', '@yok-ui/admin', '@yok-ui/brand'])
])

export const releasePackageNames = Object.freeze(releaseLevels.flat())

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

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

function validatePackageManifest(manifest, { name, manifestPath }) {
  if (!isPlainObject(manifest)) {
    throw new Error(`Release package ${name} manifest at ${manifestPath} must be a plain object`)
  }

  for (const field of dependencyFields) {
    if (Object.hasOwn(manifest, field) && !isPlainObject(manifest[field])) {
      throw new Error(
        `Release package ${name} manifest field ${field} at ${manifestPath} must be a plain object`
      )
    }
  }
}

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

  validatePackageManifest(manifest, { name, manifestPath })

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

export function validateInternalDependencies(releasePackages) {
  for (const releasePackage of releasePackages) {
    validatePackageManifest(releasePackage.manifest, releasePackage)

    for (const field of dependencyFields) {
      for (const dependencyName of Object.keys(releasePackage.manifest[field] ?? {})) {
        if (!dependencyName.startsWith('@yok-ui/')) {
          continue
        }

        const dependencyLevel = levelByPackageName.get(dependencyName)

        if (dependencyLevel === undefined) {
          throw new Error(
            `${releasePackage.name} ${field} references unknown internal package ${dependencyName} ` +
            `from release level ${releasePackage.level}`
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
