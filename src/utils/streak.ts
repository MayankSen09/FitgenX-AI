export interface DatedEntry {
  date: string;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateStreak(history: DatedEntry[], referenceDate = new Date()): number {
  if (!history || history.length === 0) return 0;

  const workoutDays = new Set<string>();
  for (const entry of history) {
    if (entry.date) {
      const parsed = new Date(entry.date);
      if (!isNaN(parsed.getTime())) {
        workoutDays.add(formatDateKey(parsed));
      }
    }
  }

  let streak = 0;
  const ref = new Date(referenceDate);

  for (let i = 0; i <= 365; i++) {
    const target = new Date(ref);
    target.setDate(ref.getDate() - i);
    const targetKey = formatDateKey(target);

    if (workoutDays.has(targetKey)) {
      streak++;
    } else if (i > 0) {
      // Allow today (i=0) to be pending without breaking yesterday's streak
      break;
    }
  }

  return streak;
}
