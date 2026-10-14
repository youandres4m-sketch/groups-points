export type PerformanceStatus = 'WINNING' | 'LOSING' | 'TIED';

export interface Team {
  id: number;
  name: string;
  netScore: number;
}

export type ScoreActionType = 'ADD_POINT' | 'SUBTRACT_POINT';

export interface ScoreAction {
  type: ScoreActionType;
  teamId: number;
  prevScore: number;
  newScore: number;
  timestamp: number;
}

export interface ScoreboardState {
  teamCount: number;
  teams: Team[];
  selectedTeamId: number | null;
  soundEnabled: boolean;
}
