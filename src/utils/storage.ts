import { Team, ScoreboardState } from '../types';

const STORAGE_KEY = 'classroom_scoreboard_state_v2';
const LEGACY_STORAGE_KEY = 'classroom_scoreboard_state_v1';

export function createDefaultTeams(count: number): Team[] {
  return Array.from({ length: count }, (_, idx) => {
    const id = idx + 1;
    return {
      id,
      name: `Team ${id}`,
      netScore: 0,
    };
  });
}

export function loadScoreboardState(): ScoreboardState {
  if (typeof window === 'undefined') {
    return {
      teamCount: 4,
      teams: createDefaultTeams(4),
      selectedTeamId: 1,
      soundEnabled: true,
    };
  }

  try {
    // 1. Try v2 format
    let raw = localStorage.getItem(STORAGE_KEY);
    let parsed: any = null;

    if (raw) {
      parsed = JSON.parse(raw);
    } else {
      // 2. Try migrating legacy v1 format
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        parsed = JSON.parse(legacyRaw);
      }
    }

    if (
      parsed &&
      Array.isArray(parsed.teams) &&
      typeof parsed.teamCount === 'number' &&
      parsed.teams.length > 0
    ) {
      const validCount = Math.max(1, Math.min(9, parsed.teamCount));
      const validTeams: Team[] = parsed.teams.slice(0, validCount).map((t: any, idx: number) => {
        let netScore = 0;
        if (typeof t.netScore === 'number') {
          netScore = t.netScore;
        } else if (typeof t.correct === 'number' || typeof t.incorrect === 'number') {
          // Migration from previous version: netScore = correct - incorrect
          netScore = (Number(t.correct) || 0) - (Number(t.incorrect) || 0);
        }

        return {
          id: idx + 1,
          name: typeof t.name === 'string' && t.name.trim().length > 0 ? t.name : `Team ${idx + 1}`,
          netScore,
        };
      });

      while (validTeams.length < validCount) {
        const id = validTeams.length + 1;
        validTeams.push({
          id,
          name: `Team ${id}`,
          netScore: 0,
        });
      }

      let validSelectedId: number | null = null;
      if (parsed.selectedTeamId !== null && parsed.selectedTeamId !== undefined) {
        const num = Number(parsed.selectedTeamId);
        if (num >= 1 && num <= validCount) {
          validSelectedId = num;
        }
      } else {
        validSelectedId = 1;
      }

      return {
        teamCount: validCount,
        teams: validTeams,
        selectedTeamId: validSelectedId,
        soundEnabled: parsed.soundEnabled !== false,
      };
    }
  } catch {
    // Ignore and fallback
  }

  return {
    teamCount: 4,
    teams: createDefaultTeams(4),
    selectedTeamId: 1,
    soundEnabled: true,
  };
}

export function saveScoreboardState(state: ScoreboardState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota
  }
}
