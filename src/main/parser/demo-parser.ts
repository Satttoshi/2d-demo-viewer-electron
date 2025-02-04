import { parseEvent, parseHeader, parseTicks } from '@laihoe/demoparser2';
import { parseRounds } from './parse-rounds';
import { createJsonFile, readJsonFile } from '../utils/file-paths';

export async function parse(demoPath: string) {
  const header = parseHeader(demoPath);
  console.log('Map:', header.map_name);

  // Get round start events to find first round
  const roundStarts = parseEvent(demoPath, 'round_start');
  const roundEnds = parseEvent(demoPath, 'round_end');

  const rounds = await parseRounds(demoPath, roundStarts, roundEnds);

  console.log('Parsed rounds:', rounds);

  const singleTick = parseTicks(
    demoPath,
    [
      'X',
      'Y',
      'yaw',
      'inventory',
      'balance',
      'game_time',
      'cash_spent_this_round',
      'health',
      'is_alive',
      'FIRE',
      'team_num',
    ],
    [9000],
    null,
    true,
  );

  try {
    const filePath = await createJsonFile('parsed_demo', singleTick);
    console.log(`JSON file created at: ${filePath}`);
    const parsedDemo = await readJsonFile('parsed_demo');
    console.log('Parsed JSON:', parsedDemo);
  } catch (error) {
    console.error('Failed to create JSON file:', error);
  }
}
