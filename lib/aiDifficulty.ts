export interface DifficultySettings {
  skill: number;
  depth: number;
  thinkingTime: number;
}

export const AI_DIFFICULTY: Record<
  number,
  {
    depth: number;
    thinkingTime: number;
  }
> = {
  1: {
    depth: 2,
    thinkingTime: 1500,
  },
  5: {
    depth: 4,
    thinkingTime: 1000,
  },
  10: {
    depth: 7,
    thinkingTime: 700,
  },
  20: {
    depth: 12,
    thinkingTime: 400,
  },
};
