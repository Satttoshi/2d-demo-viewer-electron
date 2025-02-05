import { parseGrenades, parseTicks } from '@laihoe/demoparser2';
import {
  NadeState,
  PlayerInventory,
  Round,
  RoundEnd,
  RoundStart,
  TickState,
} from '../types/demo-types';
import _ from 'lodash';

function isKnifeRound(inventories: PlayerInventory[]): boolean {
  // Check if all players only have knives or empty inventories
  return inventories.every(player => {
    return player.inventory.every(
      item =>
        // Check if item is a knife or the player has no items
        item.toLowerCase().includes('knife') || player.inventory.length === 0,
    );
  });
}

async function detectKnifeRound(
  demoPath: string,
  firstRoundStart: RoundStart,
  secondRoundStart: RoundStart,
): Promise<boolean> {
  // Get a tick somewhere in the middle of the suspected knife round
  const midRoundTick = Math.floor((firstRoundStart.tick + secondRoundStart.tick) / 2);

  // Get inventories at this tick
  const inventories = await parseTicks(demoPath, ['inventory'], [midRoundTick]);

  return isKnifeRound(inventories);
}

export async function parseRounds(
  demoPath: string,
  roundStarts: RoundStart[],
  roundEnds: RoundEnd[],
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
    const isKnife = await detectKnifeRound(demoPath, roundOneStarts[0], roundOneStarts[1]);

    if (isKnife) {
      // If it's a knife round, find the last round 1 start as our real first round
      firstRoundStartIndex = roundStarts.reduce(
        (lastIndex, event, index) => (event.round === 1 ? index : lastIndex),
        0,
      );
    }
  }

  // Get the real round starts (excluding knife round if it exists)
  const actualRoundStarts = roundStarts.slice(firstRoundStartIndex);

  // Find the first real round end that comes after our first real round start
  const firstRoundEndIndex = roundEnds.findIndex(end => end.tick > actualRoundStarts[0].tick);

  // Get the real round ends (excluding knife round if it exists)
  const actualRoundEnds = roundEnds.slice(firstRoundEndIndex);

  // Now we can zip them together with correct round numbers
  return actualRoundStarts
    .map((start, index) => {
      // If we don't have a corresponding end event, skip this round
      if (!actualRoundEnds[index]) return null;

      const end = actualRoundEnds[index];

      return {
        round: index + 1, // Correct round numbering starting from 1
        startTick: start.tick,
        endTick: end.tick,
        winner: end.winner,
        reason: end.reason,
      };
    })
    .filter((round): round is Round => round !== null);
}

export async function parseRoundData(
  demoPath: string,
  round: { startTick: number; endTick: number },
) {
  // Create array of ticks for the entire round
  const ticks: number[] = [];
  for (let tick = round.startTick; tick <= round.endTick; tick++) {
    ticks.push(tick);
  }

  // Parse the round data using the generated ticks
  const parsedTicks = parseTicks(
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
    ticks,
  );

  // Parse grenades for the round
  const parsedGrenades = parseGrenades(demoPath).filter(
    nade => nade.tick >= round.startTick && nade.tick <= round.endTick,
  );

  return transformTickData(parsedTicks, parsedGrenades);
}

/**
 * Transforms raw tick data from the demo parser into a structured format grouping players by teams
 *
 * @param {Array} tickData - Array of player states for each tick from the demo parser
 * @param nadeData
 * @returns {Array} Array of tick states with teamA (CT) and teamB (T) players grouped separately
 */
function transformTickData(tickData: Array<any>, nadeData = []): TickState[] {
  // Group all players by tick
  const groupedByTick = _.groupBy(tickData, 'tick');

  // Group nades by tick
  const groupedNades = _.groupBy(nadeData, 'tick');

  // Transform each tick's data
  return _.map(groupedByTick, (players, tick) => {
    const game_time = players[0].game_time;
    const playersByTeam = _.groupBy(players, 'team_num');

    const transformPlayer = player => ({
      name: player.name,
      x: player.x,
      y: player.y,
      health: player.health,
      yaw: player.yaw,
      is_alive: player.is_alive,
      FIRE: player.FIRE,
    });

    const transformNade = (nade: NadeState) => ({
      grenade_type: nade.grenade_type,
      name: nade.name,
      x: nade.x,
      y: nade.y,
    });

    return {
      tick: parseInt(tick),
      game_time,
      teamA: _.map(playersByTeam['3'] || [], transformPlayer),
      teamB: _.map(playersByTeam['2'] || [], transformPlayer),
      nadeEvents: groupedNades[tick] ? _.map(groupedNades[tick], transformNade) : undefined,
    };
  });
}
