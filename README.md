# StudyArena

StudyArena is an avatar-focused open-world study game built for the web. Players walk around a shared plaza, enter subject buildings, complete challenges, earn rewards, and show off their progress through cosmetics, badges, titles, and profile stats.

## Project Vision

StudyArena should feel closer to a social game than a traditional study app.

The long-term goal is a playful, competitive world inspired by open-world social games. Players should be able to:

- enter a shared plaza as an avatar
- walk to buildings like Arenas, Shop, Study Hall, and Profile
- launch study challenges through game-style menus
- earn coins, XP, subject progress, ranks, cosmetics, badges, and titles
- show off progress through avatar customization and visible achievements

The experience should stay fun and readable for beginner developers. We want small, steady improvements instead of building giant systems too early.

## Current Features

These features exist in the project right now:

- Landing page at `/` with StudyArena branding and a link to `/world`
- `/world` route that loads a Phaser game canvas inside the Next.js app
- Playable plaza scene with keyboard movement using `WASD` or arrow keys
- Placeholder plaza buildings for Arenas, Shop, Study Hall, and Profile
- Building proximity prompt that appears when the player walks near a building
- `E` interaction key to open building popups
- Arenas popup with starter subject selection
- Arenas popup with starter game mode selection
- Starter data files for subjects, game modes, shop items, and quiz questions in `apps/web/data`

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Phaser
- ESLint

## Current Folder Structure

This is the main project structure today:

```text
StudyArenaRepo/
  apps/
    web/
      app/
        page.tsx
        world/
          page.tsx
      components/
        PhaserGame.tsx
      data/
        types.ts
        subjects.ts
        gameModes.ts
        shopItems.ts
        questions.ts
        index.ts
      public/
      package.json
      tsconfig.json
  README.md
  docs/
    roadmap.md
```

## How To Run Locally

1. Open a terminal in the repo root.
2. Move into the web app:

```bash
cd apps/web
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal.
5. Visit `/` for the landing page or `/world` for the playable plaza.

If you want to run lint checks and the dependencies are already installed:

```bash
npm run lint
```

## Team Git Workflow

Use a simple, small-branch workflow so each task is easy to review and safe to merge.

1. Start from `main`.
2. Create a small feature or docs branch for one focused change.
3. Keep each branch limited to one system when possible.
4. Do not mix gameplay, styling, data, and large refactors in the same branch unless they are tightly connected.
5. Open a review when the feature is working and the current gameplay still functions.
6. Merge small improvements often instead of waiting for a huge rewrite.

Suggested branch naming:

- `feature/plaza-visual-upgrade`
- `feature/avatar-sprite`
- `feature/solo-challenge-flow`
- `docs/project-vision`
- `fix/world-popup-layout`

Practical team rules:

- Keep the existing world playable while improving one system at a time.
- Add comments when they help a beginner understand game logic.
- Avoid building future systems before the current milestone is stable.
- Prefer simple data structures and clear file names over clever abstractions.

## Current Next Milestone

The current next milestone is `feature/plaza-visual-upgrade`.

Focus for that milestone:

- make the plaza feel more like a game world
- replace plain placeholder shapes with stronger visual identity
- improve ground, paths, building presentation, and general atmosphere
- keep the current movement and building interaction working

For the full milestone plan, see [docs/roadmap.md](docs/roadmap.md).
