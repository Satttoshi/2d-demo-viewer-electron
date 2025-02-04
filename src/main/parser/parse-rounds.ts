import { parseTicks } from '@laihoe/demoparser2';
import { PlayerInventory, Round, RoundEnd, RoundStart } from '../types/demo-types';

function isKnifeRound(inventories: PlayerInventory[]): boolean {
  // Check if all players only have knives or empty inventories
  return inventories.every(player => {
    return player.inventory.every(item =>
      // Check if item is a knife or the player has no items
      item.toLowerCase().includes('knife') || player.inventory.length === 0
    );
  });
}

async function detectKnifeRound(
  demoPath: string,
  firstRoundStart: RoundStart,
  secondRoundStart: RoundStart
): Promise<boolean> {
  // Get a tick somewhere in the middle of the suspected knife round
  const midRoundTick = Math.floor((firstRoundStart.tick + secondRoundStart.tick) / 2);

  // Get inventories at this tick
  const inventories = await parseTicks(demoPath, ["inventory"], [midRoundTick]);

  return isKnifeRound(inventories);
}

export async function parseRounds(
  demoPath: string,
  roundStarts: RoundStart[],
  roundEnds: RoundEnd[]
): Promise<Round[]> {
  // If we have less than 2 round starts, there can't be a knife round
  if (roundStarts.length < 2) {
    return [];
  }

  let firstRoundStartIndex = 0;

  // Check for knife round only if we have multiple round 1 starts
  const roundOneStarts = roundStarts.filter(start => start.round === 1);
  if (roundOneStarts.length > 1) {
    // Take two consecutive round starts to check if the first is a knife round
    const isKnife = await detectKnifeRound(
      demoPath,
      roundOneStarts[0],
      roundOneStarts[1]
    );

    if (isKnife) {
      // If it's a knife round, find the last round 1 start as our real first round
      firstRoundStartIndex = roundStarts
        .reduce((lastIndex, event, index) =>
          event.round === 1 ? index : lastIndex, 0);
    }
  }

  // Get the real round starts (excluding knife round if it exists)
  const actualRoundStarts = roundStarts.slice(firstRoundStartIndex);

  // Find the first real round end that comes after our first real round start
  const firstRoundEndIndex = roundEnds.findIndex(end =>
    end.tick > actualRoundStarts[0].tick);

  // Get the real round ends (excluding knife round if it exists)
  const actualRoundEnds = roundEnds.slice(firstRoundEndIndex);

  // Now we can zip them together with correct round numbers
  return actualRoundStarts.map((start, index) => {
    // If we don't have a corresponding end event, skip this round
    if (!actualRoundEnds[index]) return null;

    const end = actualRoundEnds[index];

    return {
      round: index + 1, // Correct round numbering starting from 1
      startTick: start.tick,
      endTick: end.tick,
      winner: end.winner,
      reason: end.reason
    };
  }).filter((round): round is Round => round !== null);
}
