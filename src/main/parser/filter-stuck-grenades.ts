import _ from 'lodash';

/**
 * Filters out stuck HE grenades that remain in the same position for more than 3 consecutive ticks
 *
 * @param {Array} nades - Array of grenade events
 * @returns {Array} Filtered array without stuck HE grenades
 */
export function filterStuckGrenades(nades: Array<any>): Array<any> {
  const groupedByEntityId = _.groupBy(nades, 'entity_id');

  return _.flatMap(groupedByEntityId, entityNades => {
    // Only process HE grenades
    if (entityNades[0].grenade_type !== 'he_grenade') {
      return entityNades;
    }

    let consecutiveCount = 1;
    let lastPosition: string | null = null;

    return entityNades.filter(nade => {
      const currentPosition = `${nade.x},${nade.y}`;

      if (currentPosition === lastPosition) {
        consecutiveCount++;
        // Filter out if stuck for more than 3 ticks
        if (consecutiveCount > 3) {
          return false;
        }
      } else {
        consecutiveCount = 1;
      }

      lastPosition = currentPosition;
      return true;
    });
  });
}
