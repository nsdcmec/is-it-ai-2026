/**
 * Controlled Randomization for Quiz Questions
 * - Randomizes question order independently per attempt.
 * - Enforces maximum consecutive streak of <= 3 for the same category (Real vs AI).
 * - Avoids predictable strictly-alternating patterns (Real-AI-Real-AI...).
 * - Uses unbiased Fisher-Yates shuffle with rejection sampling and constructive fallback.
 */

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function hasExcessiveStreak(items: { ai: boolean }[], maxStreak: number = 3): boolean {
  if (!items || items.length <= maxStreak) return false;
  let streak = 1;
  for (let i = 1; i < items.length; i++) {
    if (items[i].ai === items[i - 1].ai) {
      streak++;
      if (streak > maxStreak) return true;
    } else {
      streak = 1;
    }
  }
  return false;
}

export function isStrictlyAlternating(items: { ai: boolean }[]): boolean {
  if (!items || items.length < 4) return false;
  for (let i = 1; i < items.length; i++) {
    if (items[i].ai === items[i - 1].ai) return false;
  }
  return true;
}

export function generateControlledQuizSequence<T extends { ai: boolean }>(
  items: T[],
  maxStreak: number = 3
): T[] {
  if (!items || items.length <= 2) return items ? [...items] : [];

  const realCount = items.filter((p) => !p.ai).length;
  const aiCount = items.filter((p) => p.ai).length;

  // If one category is empty, or if streak constraint is mathematically impossible
  if (realCount === 0 || aiCount === 0) {
    return shuffleArray(items);
  }

  // Attempt up to 250 unbiased Fisher-Yates shuffles with rejection sampling
  for (let attempt = 0; attempt < 250; attempt++) {
    const candidate = shuffleArray(items);
    if (!hasExcessiveStreak(candidate, maxStreak) && !isStrictlyAlternating(candidate)) {
      return candidate;
    }
  }

  // Constructive fallback algorithm
  const reals = shuffleArray(items.filter((p) => !p.ai));
  const ais = shuffleArray(items.filter((p) => p.ai));
  const result: T[] = [];
  let currentStreak = 0;
  let lastCategory: boolean | null = null;

  while (reals.length > 0 || ais.length > 0) {
    let pickAi: boolean;

    if (reals.length === 0) {
      pickAi = true;
    } else if (ais.length === 0) {
      pickAi = false;
    } else if (lastCategory !== null && currentStreak >= maxStreak) {
      // Must switch category to avoid exceeding max streak
      pickAi = !lastCategory;
    } else {
      // Weighted selection based on remaining items to avoid category starvation
      const aiWeight = ais.length / (ais.length + reals.length);
      pickAi = Math.random() < aiWeight;
    }

    const chosen = pickAi ? ais.pop() : reals.pop();
    if (!chosen) break;
    const nextItem: T = chosen;
    result.push(nextItem);

    if (nextItem.ai === lastCategory) {
      currentStreak++;
    } else {
      lastCategory = nextItem.ai;
      currentStreak = 1;
    }
  }

  return result;
}
