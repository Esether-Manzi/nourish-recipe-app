/** Finds cooking durations in a recipe step, e.g. "bake for 35 minutes" or "1 1/2 hours". */

export type StepTimer = { label: string; seconds: number };

const UNIT_SECONDS: Record<string, number> = { second: 1, sec: 1, minute: 60, min: 60, hour: 3600, hr: 3600 };

const PATTERN =
  /(\d+(?:[.,]\d+)?)(?:\s*(?:-|–|to)\s*(\d+(?:[.,]\d+)?))?\s*(?:1\/2|½)?\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)\b/gi;

export function findTimers(step: string): StepTimer[] {
  const timers: StepTimer[] = [];
  for (const match of step.matchAll(PATTERN)) {
    const [text, low, high, unitRaw] = match;
    const unit = unitRaw.toLowerCase().replace(/s$/, '');
    const perUnit = UNIT_SECONDS[unit];
    if (!perUnit) continue;
    // For ranges like "20-25 minutes", use the upper value; the cook can stop early.
    let amount = parseFloat((high ?? low).replace(',', '.'));
    if (/1\/2|½/.test(text)) amount += 0.5;
    const seconds = Math.round(amount * perUnit);
    if (seconds < 10 || seconds > 24 * 3600) continue;
    const label = text.trim().replace(/\s+/g, ' ');
    if (!timers.some((t) => t.seconds === seconds)) timers.push({ label, seconds });
  }
  return timers.slice(0, 3);
}

export function formatSeconds(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
