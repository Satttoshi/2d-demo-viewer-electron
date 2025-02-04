import { app } from 'electron'
import path from 'path'

const isDevelopment = !app.isPackaged

export const appPath = isDevelopment
  ? path.join(app.getAppPath())
  : path.join(process.resourcesPath)

/**
 * @description Get the path to a demo file in the demos directory
 * @param {string} demoName - Name of the demo file including extension (e.g., 'anubis.dem')
 * @returns {string}
 */
export function getDemoPath(demoName: string): string {
  return path.join(appPath, 'demos', demoName)
}

/**
 * @description Get the output path for parsed demo data
 * @param {string} demoName - Name of the demo file without extension
 * @returns {string}
 */
export function getParsedDemoPath(demoName: string): string {
  return path.join(
    app.getPath('userData'),
    'parsed_demos',
    demoName
  )
}

/**
 * @description Get path to the resources directory
 * @returns {string}
 */
export const resourcesPath = path.join(appPath, 'resources')
