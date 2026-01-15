/*
Create a function calculateProbabilities(k, u, h) where:

k is the multiplier (e.g., k=2 means unhit sides are twice as likely)
u is the number of unhit sides
h is the number of already hit sides
The relationship is: Pu = k × Ph
The function should return { pHit, pUnhit } where:

pHit (Ph) = probability an already hit side will be hit again
pUnhit (Pu) = probability an unhit side will be hit
The probabilities must sum to 1: u × pUnhit + h × pHit = 1

From your examples:

After 1st event (h=1, u=5, k=2): pUnhit=2/11, pHit=1/11
After 2nd event (h=2, u=4, k=2): pUnhit=2/10, pHit=1/10
The mathematical relationship I need to solve:

Pu = k × Ph
u × Pu + h × Ph = 1
Substituting: u × (k × Ph) + h × Ph = 1
Simplifying: Ph × (u × k + h) = 1
Therefore: Ph = 1 / (u × k + h) and Pu = k / (u × k + h)
*/

export function calculateProbabilities(k, u, h) {
  // Input validation: u + h should equal 6 (total sides)
  if (u + h !== 6) {
    throw new Error(`Invalid input: u + h must equal 6, got u=${u}, h=${h}`);
  }

  // Edge case 1: No sides hit yet (h=0, u=6)
  if (h === 0) {
    return {
      pHit: 0, // No hit sides exist
      pUnhit: 1 / 6, // Equal probability for all 6 unhit sides
    };
  }

  // Edge case 2: All sides hit (h=6, u=0)
  if (u === 0) {
    return {
      pHit: 1 / 6, // Equal probability for all 6 hit sides
      pUnhit: 0, // No unhit sides exist
    };
  }

  // Normal case: Calculate using the formula
  // Pu = k × Ph and u × Pu + h × Ph = 1
  // Therefore: Ph = 1 / (u × k + h) and Pu = k / (u × k + h)
  const denominator = u * k + h;
  const pHit = 1 / denominator;
  const pUnhit = k / denominator;

  return {
    pHit,
    pUnhit,
  };
}

/**
 * Calculate score based on the new scoring rules:
 * - 2 points for the first hit on any side
 * - 1 point for subsequent hits on the same side
 * @param {Array} events - Array of events with sideNumber property
 * @returns {number} - Total score
 */
export function calculateScore(events) {
  const hitCounts = new Map(); // Track how many times each side has been hit
  let score = 0;

  events.forEach((event) => {
    if (event.sideNumber) {
      const sideNumber = event.sideNumber;
      const currentCount = hitCounts.get(sideNumber) || 0;

      if (currentCount === 0) {
        // First hit on this side: 2 points
        score += 2;
      } else {
        // Subsequent hits on this side: 1 point
        score += 1;
      }

      hitCounts.set(sideNumber, currentCount + 1);
    }
  });

  return score;
}

/**
 * Calculate the number of unique sides that have been hit
 * @param {Array} events - Array of events with sideNumber property
 * @returns {number} - Number of unique sides hit (max 6)
 */
export function calculateUniqueHits(events) {
  const uniqueSides = new Set();

  events.forEach((event) => {
    if (event.sideNumber) {
      uniqueSides.add(event.sideNumber);
    }
  });

  return uniqueSides.size;
}

/**
 * Calculate adjusted pass duration based on player passing score
 * @param {number} playerPassingScore - Player's passing skill (1-10)
 * @param {number} baseDuration - Base duration at minimum skill
 * @param {number} minDuration - Minimum duration at maximum skill
 * @returns {number} - Adjusted duration in milliseconds
 */
export function getAdjustedPassDuration(
  playerPassingScore,
  baseDuration,
  minDuration
) {
  // Score of 1 → baseDuration, Score of 10 → minDuration
  // Linear interpolation
  const duration =
    baseDuration -
    ((playerPassingScore - 1) / 9) * (baseDuration - minDuration);
  return Math.round(duration);
}

/**
 * Calculate pass error rate based on player passing score
 * @param {number} playerPassingScore - Player's passing skill (1-10)
 * @returns {number} - Error rate (0.0 to 1.0)
 */
export function getPassErrorRate(playerPassingScore) {
  // Score of 1 → 1.0 (100% errors), Score of 10 → 0.0 (0% errors)
  // Linear interpolation
  const errorRate = 1 - (playerPassingScore - 1) / 9;
  return errorRate;
}

/**
 * Calculate turn error rate based on player control score
 * @param {number} playerControlScore - Player's control skill (1-10)
 * @returns {number} - Error rate (0.0 to 1.0)
 */
export function getTurnErrorRate(playerControlScore) {
  // Score of 1 → 1.0 (100% errors), Score of 10 → 0.0 (0% errors)
  // Linear interpolation
  const errorRate = 1 - (playerControlScore - 1) / 9;
  return errorRate;
}

/**
 * Calculate move error rate based on player dribbling score
 * @param {number} playerDribblingScore - Player's dribbling skill (1-10)
 * @returns {number} - Error rate (0.0 to 1.0)
 */
export function getMoveErrorRate(playerDribblingScore) {
  // Score of 1 → 1.0 (100% errors), Score of 10 → 0.0 (0% errors)
  // Linear interpolation
  const errorRate = 1 - (playerDribblingScore - 1) / 9;
  return errorRate;
}

/**
 * Calculate adjusted turn duration based on player control score
 * @param {number} playerControlScore - Player's control skill (1-10)
 * @param {number} baseDuration - Base duration at skill level 1
 * @param {number} minDuration - Minimum duration at skill level 10
 * @returns {number} - Adjusted duration in milliseconds
 */
export function getAdjustedTurnDuration(
  playerControlScore,
  baseDuration,
  minDuration
) {
  // Score of 1 → baseDuration, Score of 10 → minDuration
  // Linear interpolation
  const duration =
    baseDuration -
    ((playerControlScore - 1) / 9) * (baseDuration - minDuration);
  return Math.round(duration);
}

/**
 * Calculate adjusted move duration based on player dribbling score
 * @param {number} playerDribblingScore - Player's dribbling skill (1-10)
 * @param {number} baseDuration - Base duration at skill level 1
 * @param {number} minDuration - Minimum duration at skill level 10
 * @returns {number} - Adjusted duration in milliseconds
 */
export function getAdjustedMoveDuration(
  playerDribblingScore,
  baseDuration,
  minDuration
) {
  // Score of 1 → baseDuration, Score of 10 → minDuration
  // Linear interpolation
  const duration =
    baseDuration -
    ((playerDribblingScore - 1) / 9) * (baseDuration - minDuration);
  return Math.round(duration);
}
