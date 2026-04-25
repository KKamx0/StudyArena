"use client";

import { useEffect, useRef, useState } from "react";

// PhaserGame loads the Phaser canvas and manages the game world.
// We use useState to pass information from Phaser back to React
// so we can show HTML overlays like popups on top of the game.

export default function PhaserGame() {
  const gameContainer = useRef<HTMLDivElement | null>(null);

  // nearBuilding tracks which building the player is close to.
  // null means player is not near anything.
  const [nearBuilding, setNearBuilding] = useState<string | null>(null);

  // activeBuilding is set when the player presses E.
  // This opens the popup for that building.
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);

  // We use a ref to share nearBuilding with Phaser's update loop.
  // Phaser runs outside React so it can't read useState directly.
  const nearBuildingRef = useRef<string | null>(null);

  useEffect(() => {
    if (!gameContainer.current) return;

    let game: Phaser.Game | null = null;

    async function startGame() {
      const Phaser = await import("phaser");

      class PlazaScene extends Phaser.Scene {
        private player!: Phaser.GameObjects.Arc;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private wasdKeys!: {
          W: Phaser.Input.Keyboard.Key;
          A: Phaser.Input.Keyboard.Key;
          S: Phaser.Input.Keyboard.Key;
          D: Phaser.Input.Keyboard.Key;
        };
        private eKey!: Phaser.Input.Keyboard.Key;

        private worldWidth = 1600;
        private worldHeight = 1000;
        private speed = 5;

        // Each building has a position and a trigger radius.
        // When the player gets within that radius, the prompt appears.
        private buildings = [
          { name: "Arenas",     x: 430,  y: 250, radius: 130 },
          { name: "Shop",       x: 1170, y: 250, radius: 130 },
          { name: "Study Hall", x: 430,  y: 760, radius: 130 },
          { name: "Profile",    x: 1170, y: 760, radius: 130 },
        ];

        constructor() {
          super("PlazaScene");
        }

        create() {
          this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

          // Main ground
          this.add.rectangle(
            this.worldWidth / 2,
            this.worldHeight / 2,
            this.worldWidth,
            this.worldHeight,
            0x0f172a
          );

          // Plaza floor
          this.add
            .rectangle(800, 500, 1200, 700, 0x1e293b)
            .setStrokeStyle(5, 0x334155);

          // Walkways
          this.add.rectangle(800, 500, 1300, 120, 0x334155);
          this.add.rectangle(800, 500, 120, 800, 0x334155);

          // Center circle
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

          // Draw all buildings
          this.createBuilding(430,  250, 260, 160, 0x7c3aed, "ARENAS");
          this.createBuilding(1170, 250, 260, 160, 0xf97316, "SHOP");
          this.createBuilding(430,  760, 260, 160, 0x22c55e, "STUDY HALL");
          this.createBuilding(1170, 760, 260, 160, 0x0ea5e9, "PROFILE");

          // Signs under buildings
          this.createSign(430,  370, "Battle friends or randoms");
          this.createSign(1170, 370, "Buy clothes and rewards");
          this.createSign(430,  880, "Solo challenges");
          this.createSign(1170, 880, "Stats, rank, and avatar");

          // Player avatar
          this.player = this.add.circle(800, 620, 24, 0x22d3ee);
          this.player.setStrokeStyle(4, 0xffffff);

          // Camera follows player
          this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

          // Controls
          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasdKeys = this.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
          }) as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
          };

          // E key for entering buildings
          this.eKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
          );
        }

        update() {
          // Movement
          let moveX = 0;
          let moveY = 0;

          if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) moveX = -1;
          else if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) moveX = 1;

          if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) moveY = -1;
          else if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) moveY = 1;

          if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
          }

          const newX = this.player.x + moveX * this.speed;
          const newY = this.player.y + moveY * this.speed;

          this.player.x = Phaser.Math.Clamp(newX, 30, this.worldWidth - 30);
          this.player.y = Phaser.Math.Clamp(newY, 30, this.worldHeight - 30);

          // Check proximity to each building every frame.
          // Phaser.Math.Distance.Between calculates straight-line distance.
          let closest: string | null = null;

          for (const building of this.buildings) {
            const dist = Phaser.Math.Distance.Between(
              this.player.x, this.player.y,
              building.x, building.y
            );
            if (dist < building.radius) {
              closest = building.name;
              break;
            }
          }

          // Only call setNearBuilding when the value actually changes.
          // Calling it every frame would cause too many React re-renders.
          if (closest !== nearBuildingRef.current) {
            nearBuildingRef.current = closest;
            setNearBuilding(closest);
          }

          // If player is near a building and presses E, open the popup.
          if (
            Phaser.Input.Keyboard.JustDown(this.eKey) &&
            nearBuildingRef.current !== null
          ) {
            setActiveBuilding(nearBuildingRef.current);
          }
        }

        createBuilding(
          x: number, y: number,
          width: number, height: number,
          color: number, label: string
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

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameContainer.current!,
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
      if (game) game.destroy(true);
    };
  }, []);

  return (
    <>
      {/* Phaser canvas */}
      <div
        ref={gameContainer}
        className="absolute inset-0 z-0 h-screen w-screen overflow-hidden"
      />

      {/* "Press E" prompt — shows when player is near a building */}
      {nearBuilding && !activeBuilding && (
        <div className="absolute bottom-28 left-1/2 z-30 -translate-x-1/2 rounded-xl border border-cyan-400/50 bg-slate-900/90 px-6 py-3 text-center backdrop-blur">
          <p className="text-sm font-semibold text-cyan-300">
            Press <span className="rounded bg-slate-700 px-2 py-0.5 font-bold text-white">E</span> to enter {nearBuilding}
          </p>
        </div>
      )}

      {/* Building popup modal */}
      {activeBuilding && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-white">
              {activeBuilding}
            </h2>
            <p className="mt-3 text-slate-300">
              {activeBuilding === "Arenas" &&
                "Choose a subject and battle solo, with friends, or against randoms. Earn XP and coins for every win."}
              {activeBuilding === "Shop" &&
                "Spend your coins on clothes, accessories, and cosmetics. Show off your style in the plaza."}
              {activeBuilding === "Study Hall" &&
                "Solo challenges and focus sessions. Grind XP and complete daily quests here."}
              {activeBuilding === "Profile" &&
                "View your stats, rank, subject progress, and equipped avatar items."}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActiveBuilding(null)}
                className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => setActiveBuilding(null)}
                className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
              >
                Enter {activeBuilding}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}