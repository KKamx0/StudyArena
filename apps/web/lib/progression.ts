import {
  subjects,
  type ChallengeAnswerResult,
  type ChallengeReward,
  type PlayerProgress,
  type QuizQuestion,
} from "@/data";

const XP_BY_DIFFICULTY: Record<QuizQuestion["difficulty"], number> = {
  easy: 10,
  medium: 15,
  hard: 25,
};

const COINS_BY_DIFFICULTY: Record<QuizQuestion["difficulty"], number> = {
  easy: 5,
  medium: 8,
  hard: 12,
};

const COMPLETION_BONUS = {
  xp: 20,
  coins: 10,
};

/**
 * Create an XP bucket for every subject so future features can safely read by subject id.
 */
export function createInitialSubjectXp() {
  return Object.fromEntries(subjects.map((subject) => [subject.id, 0]));
}

export function createInitialPlayerProgress(): PlayerProgress {
  return {
    coins: 0,
    totalXp: 0,
    level: 1,
    subjectXp: createInitialSubjectXp(),
  };
}

export function getLevelFromXp(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

export function getQuestionsForSubject(
  allQuestions: QuizQuestion[],
  subjectId: string,
  questionCount = 3
): QuizQuestion[] {
  return allQuestions
    .filter((question) => question.subjectId === subjectId)
    .slice(0, questionCount);
}

export function calculateChallengeReward(
  results: ChallengeAnswerResult[],
  completedChallenge = true
): ChallengeReward {
  let xpEarned = 0;
  let coinsEarned = 0;
  let correctAnswers = 0;

  for (const result of results) {
    if (!result.isCorrect) {
      continue;
    }

    correctAnswers += 1;
    xpEarned += XP_BY_DIFFICULTY[result.difficulty];
    coinsEarned += COINS_BY_DIFFICULTY[result.difficulty];
  }

  const completionBonusXp =
    completedChallenge && results.length > 0 ? COMPLETION_BONUS.xp : 0;
  const completionBonusCoins =
    completedChallenge && results.length > 0 ? COMPLETION_BONUS.coins : 0;

  xpEarned += completionBonusXp;
  coinsEarned += completionBonusCoins;

  return {
    coinsEarned,
    xpEarned,
    subjectXpEarned: xpEarned,
    correctAnswers,
    totalQuestions: results.length,
    completionBonusXp,
    completionBonusCoins,
  };
}

export function applyChallengeReward(
  progress: PlayerProgress,
  subjectId: string,
  reward: ChallengeReward
): PlayerProgress {
  const nextTotalXp = progress.totalXp + reward.xpEarned;
  const nextSubjectXp =
    (progress.subjectXp[subjectId] ?? 0) + reward.subjectXpEarned;

  return {
    coins: progress.coins + reward.coinsEarned,
    totalXp: nextTotalXp,
    level: getLevelFromXp(nextTotalXp),
    subjectXp: {
      ...progress.subjectXp,
      [subjectId]: nextSubjectXp,
    },
  };
}
