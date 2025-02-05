export type RoundStart = {
  event_name: 'round_start';
  round: number;
  tick: number;
};

export type RoundEnd = {
  event_name: 'round_end';
  round: number;
  tick: number;
  winner: string;
  reason: string;
};

export type PlayerInventory = {
  inventory: string[];
  name: string;
  steamid: string;
  tick: number;
};

export type Round = {
  round: number;
  startTick: number;
  endTick: number;
  winner: string;
  reason: string;
};

export type PlayerState = {
  name: string;
  x: number;
  y: number;
  health: number;
  yaw: number;
  is_alive: boolean;
  FIRE: boolean;
  flash_duration?: number;
};

export type NadeState = {
  grenade_type: string;
  name: string;
  x: number;
  y: number;
};

export type TickState = {
  tick: number;
  game_time: number;
  teamA: PlayerState[];
  teamB: PlayerState[];
  nadeEvents?: NadeState[];
};
