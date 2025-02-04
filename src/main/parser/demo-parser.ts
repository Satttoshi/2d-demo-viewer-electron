import { parseEvent, parseHeader, parseTicks } from '@laihoe/demoparser2';
import { parseRounds } from './parse-rounds';

export async function parse(demoPath: string) {
  const header = parseHeader(demoPath);
  console.log('Map:', header.map_name);

  // Get round start events to find first round
  const roundStarts = parseEvent(demoPath, 'round_start');
  const roundEnds = parseEvent(demoPath, 'round_end');

  const rounds = await parseRounds(demoPath, roundStarts, roundEnds);

  console.log("Parsed rounds:", rounds);

  console.log(parseTicks(demoPath, ["X", "Y", "inventory","active_weapon" , "start_balance", "cash_spent_this_round", "health", "is_alive"], [14000]));
}
