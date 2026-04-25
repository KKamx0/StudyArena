import type { GameMode } from "./types";

/**
 * Game modes describe the main ways players can enter a StudyArena match.
 */
export const gameModes: GameMode[] = [
  {
    id: "solo-challenge",
    name: "Solo Challenge",
    description: "Play alone, answer questions at your own pace, and practice without competitive pressure.",
    isMultiplayer: false,
    isRanked: false,
  },
  {
    id: "battle-friends",
    name: "Battle Friends",
    description: "Invite friends into a private match and see who can answer the most questions correctly.",
    isMultiplayer: true,
    isRanked: false,
  },
  {
    id: "random-match",
    name: "Random Match",
    description: "Jump into a live game with another player for a quick and casual head-to-head challenge.",
    isMultiplayer: true,
    isRanked: false,
  },
  {
    id: "ranked",
    name: "Ranked",
    description: "Compete in serious matches where strong performance can improve your standing on the leaderboard.",
    isMultiplayer: true,
    isRanked: true,
  },
];
