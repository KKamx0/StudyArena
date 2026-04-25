"use client";

import { useEffect, useRef } from "react";

// This component loads the Phaser game canvas.
// Right now, we are building the first playable StudyArena plaza.

export default function PhaserGame() {
  // This ref points to the HTML div where Phaser will place the canvas.
  const gameContainer = useRef<HTMLDivElement | null>(null);

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

        private worldWidth = 1600;
        private worldHeight = 1000;
        private speed = 7;

        constructor() {
          super("PlazaScene");
        }

        create() {
          // Set the size of the full playable world.
          // The world is bigger than the screen, so the camera can follow the player.
          this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

          // Main ground/background.
          this.add.rectangle(
            this.worldWidth / 2,
            this.worldHeight / 2,
            this.worldWidth,
            this.worldHeight,
            0x0f172a
          );

          // Main plaza floor.
          this.add
            .rectangle(800, 500, 1200, 700, 0x1e293b)
            .setStrokeStyle(5, 0x334155);

          // Horizontal walkway.
          this.add.rectangle(800, 500, 1300, 120, 0x334155);

          // Vertical walkway.
          this.add.rectangle(800, 500, 120, 800, 0x334155);

          // Center plaza circle.
          this.add
            .circle(800, 500, 120, 0x0e7490)
            .setStrokeStyle(5, 0x67e8f9);

          // Center label.
          this.add
            .text(800, 500, "PLAZA", {
              fontSize: "28px",
              color: "#ffffff",
              fontFamily: "Arial",
              fontStyle: "bold",
            })
            .setOrigin(0.5);

          // Buildings/locations.
          this.createBuilding(430, 250, 260, 160, 0x7c3aed, "ARENAS");
          this.createBuilding(1170, 250, 260, 160, 0xf97316, "SHOP");
          this.createBuilding(430, 760, 260, 160, 0x22c55e, "STUDY HALL");
          this.createBuilding(1170, 760, 260, 160, 0x0ea5e9, "PROFILE");

          // Add small signs near each building.
          this.createSign(430, 370, "Battle friends or randoms");
          this.createSign(1170, 370, "Buy clothes and rewards");
          this.createSign(430, 880, "Solo challenges");
          this.createSign(1170, 880, "Stats, rank, and avatar");

          // Temporary player avatar.
          // Later, this will become a real character sprite.
          this.player = this.add.circle(800, 620, 24, 0x22d3ee);
          this.player.setStrokeStyle(4, 0xffffff);

          // Camera follows the player.
          this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

          // Arrow key controls.
          this.cursors = this.input.keyboard!.createCursorKeys();

          // WASD controls.
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
        }

        update() {
          let moveX = 0;
          let moveY = 0;

          // Left/right movement.
          if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) {
            moveX = -1;
          } else if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) {
            moveX = 1;
          }

          // Up/down movement.
          if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) {
            moveY = -1;
          } else if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) {
            moveY = 1;
          }

          // Normalize diagonal movement so diagonal speed is not faster.
          if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
          }

          const newX = this.player.x + moveX * this.speed;
          const newY = this.player.y + moveY * this.speed;

          // Keep player inside the world bounds.
          this.player.x = Phaser.Math.Clamp(newX, 30, this.worldWidth - 30);
          this.player.y = Phaser.Math.Clamp(newY, 30, this.worldHeight - 30);
        }

        // Helper function for drawing buildings.
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

          // Door.
          this.add
            .rectangle(x, y + height / 2 - 20, 80, 40, 0x020617)
            .setStrokeStyle(3, 0x67e8f9);
        }

        // Helper function for small signs under buildings.
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
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    }

    startGame();

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  return (
    <div
      ref={gameContainer}
      className="absolute inset-0 z-0 h-screen w-screen overflow-hidden"
    />
  );
}