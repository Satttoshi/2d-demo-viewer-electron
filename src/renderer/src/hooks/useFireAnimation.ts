import { useState, useEffect } from 'react';
import { includes, toLower, words } from 'lodash';

type FireAnimationResult = {
  fireStartX: number;
  fireStartY: number;
  fireEndX: number;
  fireEndY: number;
  opacity: number;
  shouldShow: boolean;
};

const excludedWeapons = [
  'knife',
  'taser',
  'c4',
  'grenade',
  'molotov',
  'flashbang',
  'decoy',
  'smoke',
];

const isExcludedWeapon = (weaponName: string | null): boolean => {
  if (!weaponName) return false;

  // Convert to lowercase
  const normalizedWeaponName = toLower(weaponName);

  // Split the weapon name into individual words
  const weaponWords = words(normalizedWeaponName);

  // Check each excluded weapon against:
  // 1. Full match
  // 2. Individual words match
  // 3. Substring match
  return excludedWeapons.some(excluded => {
    const normalizedExcluded = toLower(excluded);

    return (
      // Full exact match
      normalizedWeaponName === normalizedExcluded ||
      // Match any individual word
      weaponWords.includes(normalizedExcluded) ||
      // Check if it's part of a compound word (e.g., "knife_tactical")
      includes(normalizedWeaponName, normalizedExcluded)
    );
  });
};

export const useFireAnimation = (
  activeWeaponName: string | null,
  isFiring: boolean,
  directionX: number,
  directionY: number,
  yawRadians: number,
): FireAnimationResult => {
  const [fireAnimationProgress, setFireAnimationProgress] = useState(0);
  const isExcluded = isExcludedWeapon(activeWeaponName);

  useEffect(() => {
    // Don't animate if weapon is excluded or not firing
    if (!isFiring || isExcluded) {
      setFireAnimationProgress(0);
      return;
    }

    const animate = () => {
      setFireAnimationProgress(prev => (prev + 0.1) % 1);
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [isFiring, isExcluded]);

  const fireLength = 30;
  const totalDistance = 200;

  const startOffset = totalDistance * fireAnimationProgress;
  const fireStartX = directionX + Math.cos(yawRadians) * startOffset;
  const fireStartY = directionY - Math.sin(yawRadians) * startOffset;
  const fireEndX = fireStartX + Math.cos(yawRadians) * fireLength;
  const fireEndY = fireStartY - Math.sin(yawRadians) * fireLength;

  return {
    fireStartX,
    fireStartY,
    fireEndX,
    fireEndY,
    opacity: 1 - fireAnimationProgress,
    shouldShow: isFiring && !isExcluded,
  };
};
