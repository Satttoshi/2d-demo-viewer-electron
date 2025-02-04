import { app } from 'electron';
import path from 'path';
import { writeFile, mkdir, readFile } from 'fs/promises';

const isDevelopment = !app.isPackaged;

export const appPath = isDevelopment
  ? path.join(app.getAppPath())
  : path.join(process.resourcesPath);

/**
 * @description Get the path to a demo file in the demos directory
 * @param {string} demoName - Name of the demo file including extension (e.g., 'anubis.dem')
 * @returns {string}
 */
export function getDemoPath(demoName: string): string {
  return path.join(appPath, 'demos', demoName);
}

/**
 * @description Get the output path for parsed demo data
 * @param {string} demoName - Name of the demo file without extension
 * @returns {string}
 */
export function getParsedDemoPath(demoName: string): string {
  return path.join(app.getPath('userData'), 'parsed_demos', demoName);
}

/**
 * @description Get path to the resources directory
 * @returns {string}
 */
export const resourcesPath = path.join(appPath, 'resources');

/**
 * @description Create a JSON file in the parsed directory
 * @param {string} filename - Name of the file without .json extension
 * @param {any} data - Data to be written to the JSON file
 * @returns {Promise<string>} Path to the created JSON file
 */
export async function createJsonFile(filename: string, data: any): Promise<string> {
  // Create the parsed directory if it doesn't exist
  const parsedDir = path.join(appPath, 'parsed');
  await mkdir(parsedDir, { recursive: true });

  // Create and write the JSON file
  const filePath = path.join(parsedDir, `${filename}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

  return filePath;
}

/**
 * @description Reads and parses a JSON file from the parsed directory
 * @param {string} filename - Name of the file without .json extension
 * @returns {Promise<any>} Parsed JSON data
 * @throws {Error} If file doesn't exist or content isn't valid JSON
 */
export async function readJsonFile(filename: string): Promise<any> {
  const filePath = path.join(appPath, 'parsed', `${filename}.json`);
  const fileContent = await readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}
