import { parseEvent, parseHeader, parseTicks } from '@laihoe/demoparser2';
import { parseRoundData, parseRounds } from './parse-rounds';
import { createJsonFile } from '../utils/file-paths';

export async function parse(demoPath: string) {
  const header = parseHeader(demoPath);
  console.log('Map:', header.map_name);

  // Get round start events to find first round
  const roundStarts = parseEvent(demoPath, 'round_start');
  const roundEnds = parseEvent(demoPath, 'round_end');

  const rounds = await parseRounds(demoPath, roundStarts, roundEnds);

  console.log('Parsed rounds:', rounds);

  const round = rounds[9];
  const firstRoundData = await parseRoundData(demoPath, round);

  const test = parseTicks(demoPath, ['flash_duration'], [25000]);

  console.log('Test:', test);

  try {
    const filePath = await createJsonFile('parsed_demo', firstRoundData);
    console.log(`JSON file created at: ${filePath}`);
  } catch (error) {
    console.error('Failed to create JSON file:', error);
  }
}
