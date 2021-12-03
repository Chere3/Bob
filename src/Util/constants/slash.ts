export type slashCommandsTypes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type slashCommandsTypess =
  | "SUB_COMMAND"
  | "SUB_COMMAND_GROUP"
  | "STRING"
  | "INTEGER"
  | "BOOLEAN"
  | "USER"
  | "CHANNEL"
  | "ROLE"
  | "MENTIONABLE"
  | "NUMBER";

export type slashOptions = slashCommandsTypes | slashCommandsTypess;

export interface slashStructure {
  name: string;
  type: slashOptions;
  description: string;
  required: boolean;
  choices?: choice[];
}

export interface choice {
  name: string;
  value: string;
}
