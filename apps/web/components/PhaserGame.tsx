"use client";

import type * as PhaserTypes from "phaser";
import { useEffect, useRef, useState } from "react";
import {
  gameModes,
  questions,
  subjects,
  type ChallengeReward,
  type GameMode,
  type PlayerProgress,
  type Subject,
} from "@/data";
import {
  applyChallengeReward,
  calculateChallengeReward,
  getQuestionsForSubject,
} from "@/lib/progression";

type BuildingName = "Arenas" | "Shop" | "Study Hall" | "Profile";

type PhaserGameProps = {
  playerProgress: PlayerProgress;
  onPlayerProgressChange: (progress: PlayerProgress) => void;
};

type RewardResult = ChallengeReward & {
  subjectId: string;
  subjectName: string;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
};

export default function PhaserGame({
  playerProgress,
  onPlayerProgressChange,
}: PhaserGameProps) {
  const gameContainer = useRef<HTMLDivElement | null>(null);

  const [nearBuilding, setNearBuilding] = useState<BuildingName | null>(null);
  const [activeBuilding, setActiveBuilding] = useState<BuildingName | null>(
    null
  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [lastReward, setLastReward] = useState<RewardResult | null>(null);

  const nearBuildingRef = useRef<BuildingName | null>(null);

  function closePopup() {
    setActiveBuilding(null);
    setSelectedSubject(null);
    setSelectedMode(null);
    setLastReward(null);
  }

  useEffect(() => {
    if (!gameContainer.current) return;

    let game: PhaserTypes.Game | null = null;
    let destroyed = false;

    async function startGame() {
      const Phaser = await import("phaser");

      class PlazaScene extends Phaser.Scene {
        private player!: PhaserTypes.GameObjects.Arc;
        private cursors!: PhaserTypes.Types.Input.Keyboard.CursorKeys;
        private wasdKeys!: Record<
          "W" | "A" | "S" | "D",
          PhaserTypes.Input.Keyboard.Key
        >;
        private eKey!: PhaserTypes.Input.Keyboard.Key;

        private worldWidth = 1600;
        private worldHeight = 1000;
        private speed = 7;

        private buildings: {
          name: BuildingName;
          x: number;
          y: number;
          radius: number;
        }[] = [
          { name: "Arenas", x: 430, y: 250, radius: 130 },
          { name: "Shop", x: 1170, y: 250, radius: 130 },
          { name: "Study Hall", x: 430, y: 760, radius: 130 },
          { name: "Profile", x: 1170, y: 760, radius: 130 },
        ];

        constructor() {
          super("PlazaScene");
        }

        create() {
          this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

          this.add.rectangle(
            this.worldWidth / 2,
            this.worldHeight / 2,
            this.worldWidth,
            this.worldHeight,
            0x0f172a
          );

          this.add
            .rectangle(800, 500, 1200, 700, 0x1e293b)
            .setStrokeStyle(5, 0x334155);

          this.add.rectangle(800, 500, 1300, 120, 0x334155);
          this.add.rectangle(800, 500, 120, 800, 0x334155);

          this.add
            .circle(800, 500, 120, 0x0e7490)
            .setStrokeStyle(5, 0x67e8f9);

          this.add
            .text(800, 500, "PLAZA", {
              fontSize: "28px",
              color: "#ffffff",
              fontFamily: "Arial",
              fontStyle: "bold",
            })
            .setOrigin(0.5);

          this.createBuilding(430, 250, 260, 160, 0x7c3aed, "ARENAS");
          this.createBuilding(1170, 250, 260, 160, 0xf97316, "SHOP");
          this.createBuilding(430, 760, 260, 160, 0x22c55e, "STUDY HALL");
          this.createBuilding(1170, 760, 260, 160, 0x0ea5e9, "PROFILE");

          this.createSign(430, 370, "Battle friends or randoms");
          this.createSign(1170, 370, "Buy clothes and rewards");
          this.createSign(430, 880, "Solo challenges");
          this.createSign(1170, 880, "Stats, rank, and avatar");

          this.player = this.add.circle(800, 620, 24, 0x22d3ee);
          this.player.setStrokeStyle(4, 0xffffff);

          this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

          this.cursors = this.input.keyboard!.createCursorKeys();

          this.wasdKeys = this.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
          }) as Record<"W" | "A" | "S" | "D", PhaserTypes.Input.Keyboard.Key>;

          this.eKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
          );
        }

        update() {
          let moveX = 0;
          let moveY = 0;

          if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) {
            moveX = -1;
          } else if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) {
            moveX = 1;
          }

          if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) {
            moveY = -1;
          } else if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) {
            moveY = 1;
          }

          if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
          }

          const newX = this.player.x + moveX * this.speed;
          const newY = this.player.y + moveY * this.speed;

          this.player.x = Phaser.Math.Clamp(newX, 30, this.worldWidth - 30);
          this.player.y = Phaser.Math.Clamp(newY, 30, this.worldHeight - 30);

          let closest: BuildingName | null = null;

          for (const building of this.buildings) {
            const distance = Phaser.Math.Distance.Between(
              this.player.x,
              this.player.y,
              building.x,
              building.y
            );

            if (distance < building.radius) {
              closest = building.name;
              break;
            }
          }

          if (closest !== nearBuildingRef.current) {
            nearBuildingRef.current = closest;
            setNearBuilding(closest);
          }

          if (
            Phaser.Input.Keyboard.JustDown(this.eKey) &&
            nearBuildingRef.current !== null
          ) {
            setActiveBuilding(nearBuildingRef.current);
          }
        }

        createBuilding(
          x: number,
          y: number,
          width: number,
          height: number,
          color: number,
          label: string
        ) {
          this.add
            .rectangle(x, y, width, height, color)
            .setStrokeStyle(5, 0xffffff, 0.35);

          this.add
            .text(x, y - 15, label, {
              fontSize: "24px",
              color: "#ffffff",
              fontFamily: "Arial",
              fontStyle: "bold",
            })
            .setOrigin(0.5);

          this.add
            .rectangle(x, y + height / 2 - 20, 80, 40, 0x020617)
            .setStrokeStyle(3, 0x67e8f9);
        }

        createSign(x: number, y: number, label: string) {
          this.add
            .rectangle(x, y, 260, 38, 0x020617, 0.85)
            .setStrokeStyle(2, 0x334155);

          this.add
            .text(x, y, label, {
              fontSize: "15px",
              color: "#cbd5e1",
              fontFamily: "Arial",
            })
            .setOrigin(0.5);
        }
      }

      if (destroyed || !gameContainer.current) return;

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: gameContainer.current,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#0f172a",
        scene: PlazaScene,
        audio: {
          noAudio: true,
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    }

    startGame();

    return () => {
      destroyed = true;

      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  function getBuildingDescription(building: BuildingName) {
    if (building === "Shop") {
      return "Spend your coins on clothes, accessories, and cosmetics. Show off your style in the plaza.";
    }

    if (building === "Study Hall") {
      return "Solo challenges and focus sessions. Grind XP and complete daily quests here.";
    }

    if (building === "Profile") {
      return "View your stats, rank, subject progress, and equipped avatar items.";
    }

    return "";
  }

  function handlePrototypeSoloChallenge(subject: Subject, mode: GameMode) {
    if (mode.id !== "solo-challenge") {
      return;
    }

    const challengeQuestions = getQuestionsForSubject(questions, subject.id, 3);

    if (challengeQuestions.length === 0) {
      return;
    }

    // This lets us test the reward system before the full quiz flow is built.
    const answerResults = challengeQuestions.map((question) => ({
      difficulty: question.difficulty,
      isCorrect: true,
    }));

    const reward = calculateChallengeReward(answerResults);
    const updatedProgress = applyChallengeReward(
      playerProgress,
      subject.id,
      reward
    );

    onPlayerProgressChange(updatedProgress);

    setLastReward({
      ...reward,
      subjectId: subject.id,
      subjectName: subject.name,
      previousLevel: playerProgress.level,
      newLevel: updatedProgress.level,
      leveledUp: updatedProgress.level > playerProgress.level,
    });
  }

  const selectedSubjectData = subjects.find(
    (subject) => subject.id === selectedSubject
  );
  const selectedModeData = gameModes.find((mode) => mode.id === selectedMode);

  const previewQuestions = selectedSubject
    ? getQuestionsForSubject(questions, selectedSubject, 3)
    : [];

  const rewardPreview =
    selectedModeData?.id === "solo-challenge" && previewQuestions.length > 0
      ? calculateChallengeReward(
          previewQuestions.map((question) => ({
            difficulty: question.difficulty,
            isCorrect: true,
          }))
        )
      : null;

  return (
    <>
      <div
        ref={gameContainer}
        className="absolute inset-0 z-0 h-screen w-screen overflow-hidden"
      />

      {nearBuilding && !activeBuilding && (
        <div className="absolute bottom-28 left-1/2 z-30 -translate-x-1/2 rounded-xl border border-cyan-400/50 bg-slate-900/90 px-6 py-3 text-center shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold text-cyan-300">
            Press{" "}
            <span className="rounded bg-slate-700 px-2 py-0.5 font-bold text-white">
              E
            </span>{" "}
            to enter {nearBuilding}
          </p>
        </div>
      )}

      {activeBuilding && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-8 py-12 backdrop-blur-sm">
          <div className="relative w-full max-w-7xl rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <button
              onClick={closePopup}
              aria-label="Close popup"
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-xl font-black text-white shadow-lg hover:bg-red-400"
            >
              X
            </button>

            <div className="mb-4 pr-14">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
                StudyArena Plaza
              </p>

              <h2 className="mt-1 text-4xl font-black leading-none tracking-tight text-white">
                {activeBuilding}
              </h2>

              {activeBuilding === "Arenas" && (
                <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
                  Select a subject, choose a mode, then launch your challenge.
                </p>
              )}
            </div>

            {activeBuilding === "Arenas" ? (
              <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
                <section className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <div className="mb-3 border-b border-slate-700 pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                      Subject
                    </p>
                    <h3 className="text-lg font-black text-white">
                      Choose Your Arena
                    </h3>
                  </div>

                  <div className="grid gap-2">
                    {subjects.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => {
                          setSelectedSubject(subject.id);
                          setSelectedMode(null);
                          setLastReward(null);
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-left shadow-lg transition ${
                          selectedSubject === subject.id
                            ? "border-cyan-300 bg-cyan-400 text-slate-950"
                            : "border-slate-700 bg-slate-800 text-white hover:border-cyan-400"
                        }`}
                      >
                        <p className="text-sm font-bold">{subject.name}</p>
                        <p
                          className={`mt-0.5 text-xs leading-snug ${
                            selectedSubject === subject.id
                              ? "text-slate-900"
                              : "text-slate-300"
                          }`}
                        >
                          {subject.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <div className="mb-3 border-b border-slate-700 pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                      Mode
                    </p>
                    <h3 className="text-lg font-black text-white">
                      Pick Your Match
                    </h3>
                  </div>

                  {!selectedSubject && (
                    <p className="mb-3 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300">
                      Pick a subject first to unlock game modes.
                    </p>
                  )}

                  <div className="grid gap-2">
                    {gameModes.map((mode) => (
                      <button
                        key={mode.id}
                        disabled={!selectedSubject}
                        onClick={() => {
                          setSelectedMode(mode.id);
                          setLastReward(null);
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-left shadow-lg transition ${
                          selectedMode === mode.id
                            ? "border-cyan-300 bg-cyan-400 text-slate-950"
                            : selectedSubject
                              ? "border-slate-700 bg-slate-800 text-white hover:border-cyan-400"
                              : "cursor-not-allowed border-slate-800 bg-slate-900 text-slate-500"
                        }`}
                      >
                        <p className="text-sm font-bold">{mode.name}</p>
                        <p
                          className={`mt-0.5 text-xs leading-snug ${
                            selectedMode === mode.id
                              ? "text-slate-900"
                              : selectedSubject
                                ? "text-slate-300"
                                : "text-slate-600"
                          }`}
                        >
                          {mode.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-cyan-400/40 bg-slate-950 p-4">
                  <div className="mb-3 border-b border-cyan-400/30 pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                      Launch
                    </p>
                    <h3 className="text-lg font-black text-white">
                      Match Setup
                    </h3>
                  </div>

                  {!selectedSubjectData && (
                    <p className="text-sm leading-relaxed text-slate-400">
                      Select a subject to begin setting up your challenge.
                    </p>
                  )}

                  {selectedSubjectData && !selectedModeData && (
                    <p className="text-sm leading-relaxed text-slate-300">
                      You selected{" "}
                      <span className="font-bold text-cyan-300">
                        {selectedSubjectData.name}
                      </span>
                      . Now choose a game mode.
                    </p>
                  )}

                  {selectedSubjectData && selectedModeData && (
                    <>
                      <p className="text-sm leading-relaxed text-slate-300">
                        You selected{" "}
                        <span className="font-bold text-cyan-300">
                          {selectedSubjectData.name}
                        </span>{" "}
                        in{" "}
                        <span className="font-bold text-cyan-300">
                          {selectedModeData.name}
                        </span>
                        .
                      </p>

                      {selectedModeData.id === "solo-challenge" &&
                        previewQuestions.length > 0 &&
                        rewardPreview && (
                          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-3 py-3">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                              Rewards Preview
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                              Prototype run pays {rewardPreview.xpEarned} XP and{" "}
                              {rewardPreview.coinsEarned} coins.
                            </p>
                            <p className="mt-1 text-xs text-slate-300">
                              Uses the first {previewQuestions.length} starter
                              questions for {selectedSubjectData.name}.
                            </p>
                          </div>
                        )}

                      {selectedModeData.id === "solo-challenge" &&
                        previewQuestions.length === 0 && (
                          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-3">
                            <p className="text-sm font-semibold text-amber-200">
                              Starter questions for {selectedSubjectData.name} are
                              coming soon.
                            </p>
                            <p className="mt-1 text-xs text-amber-100/80">
                              XP and coins are wired up, but this subject needs
                              quiz content before it can award them.
                            </p>
                          </div>
                        )}

                      {selectedModeData.id !== "solo-challenge" && (
                        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-3 py-3">
                          <p className="text-sm font-semibold text-white">
                            Solo Challenge is the first rewards-enabled mode.
                          </p>
                          <p className="mt-1 text-xs text-slate-300">
                            Friend battles, random matches, and ranked can reuse
                            the same XP and coin helpers later.
                          </p>
                        </div>
                      )}

                      {lastReward &&
                        lastReward.subjectId === selectedSubjectData.id && (
                          <div className="mt-4 rounded-xl border border-cyan-400/40 bg-cyan-950/20 px-3 py-3">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                              Last Reward
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                              {lastReward.subjectName} practice run complete: +
                              {lastReward.xpEarned} XP and +
                              {lastReward.coinsEarned} coins.
                            </p>
                            <p className="mt-1 text-xs text-slate-300">
                              Correct answers: {lastReward.correctAnswers}/
                              {lastReward.totalQuestions}
                            </p>
                            <p className="mt-1 text-xs text-slate-300">
                              Subject XP earned: +{lastReward.subjectXpEarned}
                            </p>
                            {lastReward.leveledUp && (
                              <p className="mt-1 text-xs font-semibold text-cyan-200">
                                Level up: {lastReward.previousLevel} to{" "}
                                {lastReward.newLevel}
                              </p>
                            )}
                          </div>
                        )}

                      <button
                        onClick={() =>
                          handlePrototypeSoloChallenge(
                            selectedSubjectData,
                            selectedModeData
                          )
                        }
                        disabled={
                          selectedModeData.id !== "solo-challenge" ||
                          previewQuestions.length === 0
                        }
                        className={`mt-4 w-full rounded-xl px-5 py-3 text-sm font-bold shadow-lg transition ${
                          selectedModeData.id === "solo-challenge" &&
                          previewQuestions.length > 0
                            ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                            : "cursor-not-allowed bg-slate-700 text-slate-300"
                        }`}
                      >
                        Complete Prototype Solo Run
                      </button>
                    </>
                  )}
                </section>
              </div>
            ) : activeBuilding === "Profile" ? (
              <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                <section className="rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                    Account Progress
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    Level {playerProgress.level}
                  </h3>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Coins
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {playerProgress.coins}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Total XP
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {playerProgress.totalXp}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                    Subject Progress
                  </p>
                  <h3 className="mt-1 text-lg font-black text-white">
                    XP By Subject
                  </h3>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3"
                      >
                        <p className="text-sm font-bold text-white">
                          {subject.icon} {subject.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-300">
                          {subject.xpName}: {playerProgress.subjectXp[subject.id] ?? 0}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div>
                <p className="text-slate-300">
                  {getBuildingDescription(activeBuilding)}
                </p>

                <button
                  onClick={closePopup}
                  className="mt-6 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Enter {activeBuilding}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
