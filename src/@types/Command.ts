export interface Command {
  cmd: string;
  executed: boolean;
}

export interface CommandState {
  current: Command | null;
}
