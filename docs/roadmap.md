# StudyArena Roadmap

This roadmap is meant to help future tasks stay focused, practical, and safe for the current codebase.

## Current Project Status

StudyArena already has the early foundation for an open-world study game:

- The project uses Next.js, React, TypeScript, Tailwind CSS, and Phaser.
- The homepage exists and links to `/world`.
- The `/world` page loads a Phaser scene through `PhaserGame.tsx`.
- The player can move around the plaza with `WASD` or arrow keys.
- The plaza includes placeholder buildings for Arenas, Shop, Study Hall, and Profile.
- The player can walk near a building and press `E` to open a popup.
- The Arenas popup already supports choosing a subject and a game mode.
- Starter data exists in `apps/web/data` for subjects, game modes, shop items, and quiz questions.

The project is still in the prototype stage. The goal right now is to improve one clear system at a time without breaking the current plaza flow.

## Next 8 Milestones

### 1. Plaza Visual Upgrade

**Goal**

Make the plaza feel more like a game world and less like a placeholder scene.

**Why It Matters**

The plaza is the first playable space. Better visuals will make the project easier to understand, more motivating to build, and more fun to test.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- `apps/web/app/world/page.tsx`
- `apps/web/public/...` for future art assets if needed

**Suggested Branch Name**

- `feature/plaza-visual-upgrade`

**Definition Of Done**

- The plaza has a more intentional layout and stronger game feel.
- Buildings are easier to identify at a glance.
- The current movement, proximity prompt, and `E` interaction still work.
- No arena menu behavior is broken.

### 2. Avatar Sprite And Simple Animation

**Goal**

Replace the current simple player shape with a basic avatar sprite and starter movement animation.

**Why It Matters**

StudyArena is avatar-focused. A visible character makes the game loop feel more personal right away.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- `apps/web/public/...` for sprite assets

**Suggested Branch Name**

- `feature/avatar-sprite`

**Definition Of Done**

- The player is represented by a sprite instead of a plain circle.
- The avatar changes direction while moving.
- A simple idle or walk animation exists.
- Existing movement controls still feel stable.

### 3. Solo Challenge Quiz Flow

**Goal**

Turn the current arena setup screen into a real solo challenge flow using the starter question data.

**Why It Matters**

This is the first real learning loop. It connects the plaza, subject choice, and gameplay reward direction.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- `apps/web/data/questions.ts`
- `apps/web/data/subjects.ts`
- possible new files under `apps/web/components/` for quiz UI

**Suggested Branch Name**

- `feature/solo-challenge-flow`

**Definition Of Done**

- A player can choose a subject and launch a solo quiz.
- The quiz shows one question at a time.
- The player can answer and see whether the answer is correct.
- The challenge can end cleanly and return to a finished state.

### 4. XP And Coins System

**Goal**

Add a simple local reward system for quiz completion.

**Why It Matters**

Rewards give the player a reason to keep studying and make future shop and profile systems meaningful.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- `apps/web/app/world/page.tsx`
- possible new helper files under `apps/web/` for local game state

**Suggested Branch Name**

- `feature/xp-and-coins`

**Definition Of Done**

- Completing a solo challenge awards coins and XP.
- The HUD updates to show the latest values.
- The values stay consistent during the active session.
- Reward logic is simple and easy to read.

### 5. Shop Menu And Starter Cosmetics

**Goal**

Use the starter shop data to build the first real Shop popup and cosmetic unlock flow.

**Why It Matters**

The reward loop needs a place where players can spend progress and feel ownership over their avatar.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- `apps/web/data/shopItems.ts`
- possible new files under `apps/web/components/` for shop UI

**Suggested Branch Name**

- `feature/shop-menu`

**Definition Of Done**

- The Shop popup lists starter items from `apps/web/data/shopItems.ts`.
- Locked and unlocked states are visible.
- Item requirements are clear.
- Buying or unlocking an item updates the local player state.

### 6. Profile And Stats Menu

**Goal**

Build a first version of the Profile popup with visible progression stats.

**Why It Matters**

Profile is where players show off effort. It supports the social and competitive direction of the game.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- `apps/web/data/subjects.ts`
- possible new files under `apps/web/components/` for profile UI

**Suggested Branch Name**

- `feature/profile-stats-menu`

**Definition Of Done**

- The Profile popup shows coins, XP, level, and basic subject progress.
- Equipped cosmetic, badge, or title placeholders are visible.
- The screen feels game-like and readable.
- Profile data matches the current local session state.

### 7. Better Map And Collisions

**Goal**

Improve world boundaries, building layout, and collision behavior so movement feels cleaner.

**Why It Matters**

A better map makes the world easier to navigate and prepares the project for more systems later.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- `apps/web/public/...` for future map assets

**Suggested Branch Name**

- `feature/world-collisions`

**Definition Of Done**

- The player cannot move through blocked building areas.
- Paths and walkable areas are more intentional.
- Collision behavior feels predictable.
- World navigation still works without confusing edge cases.

### 8. Multiplayer Prototype

**Goal**

Create a very small prototype for seeing or simulating other players in the world.

**Why It Matters**

The project vision is social. Even a lightweight prototype helps validate the direction before building deeper multiplayer systems.

**Likely Files Touched**

- `apps/web/components/PhaserGame.tsx`
- possible new files under `apps/web/` for multiplayer state or mock networking

**Suggested Branch Name**

- `feature/multiplayer-prototype`

**Definition Of Done**

- The world can represent more than one player, even if the data is mocked at first.
- The local player experience still works.
- The prototype is clearly scoped and does not attempt full matchmaking.
- The code stays simple enough for future replacement.

## Do Not Build Yet

These ideas are valid later, but they should not be built right now:

- Full ranked matchmaking
- Live chat
- Trading
- Pets
- Huge map
- Real-money purchases
- Advanced anti-cheat
- Mobile polish

## Recommended Next Feature

Start with:

- `feature/plaza-visual-upgrade`

Why this one is next:

- It improves the first playable experience immediately.
- It keeps the current systems intact.
- It creates a stronger base for avatar art, map polish, and future social features.
