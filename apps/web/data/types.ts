/**
 * Shared starter data types for the StudyArena game systems.
 * These are kept small and beginner-friendly so they can be reused later.
 */

export type Subject = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  xpName: string;
};

export type GameMode = {
  id: string;
  name: string;
  description: string;
  isMultiplayer: boolean;
  isRanked: boolean;
};

export type ShopItem = {
  id: string;
  name: string;
  type: "clothing" | "accessory" | "title" | "badge";
  price: number;
  requiredSubjectId: string | null;
  requiredLevel: number;
  rarity: "common" | "rare" | "epic" | "legendary";
};

export type QuizQuestion = {
  id: string;
  subjectId: string;
  prompt: string;
  choices: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};
