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

/**
 * We keep subject XP separate so later reward systems can unlock by subject.
 */
export type SubjectXpMap = Record<string, number>;

export type PlayerProgress = {
  coins: number;
  totalXp: number;
  level: number;
  subjectXp: SubjectXpMap;
};

export type ChallengeAnswerResult = {
  difficulty: QuizQuestion["difficulty"];
  isCorrect: boolean;
};

export type ChallengeReward = {
  coinsEarned: number;
  xpEarned: number;
  subjectXpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  completionBonusXp: number;
  completionBonusCoins: number;
};
