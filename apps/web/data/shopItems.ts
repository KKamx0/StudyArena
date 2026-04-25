import type { ShopItem } from "./types";

/**
 * Starter cosmetic rewards for a future in-game shop.
 * Subject requirements let us gate items behind learning progress later.
 */
export const shopItems: ShopItem[] = [
  {
    id: "math-hoodie",
    name: "Math Hoodie",
    type: "clothing",
    price: 250,
    requiredSubjectId: "math",
    requiredLevel: 2,
    rarity: "common",
  },
  {
    id: "cyber-ninja-mask",
    name: "Cyber Ninja Mask",
    type: "accessory",
    price: 600,
    requiredSubjectId: "cybersecurity",
    requiredLevel: 4,
    rarity: "rare",
  },
  {
    id: "code-lab-coat",
    name: "Code Lab Coat",
    type: "clothing",
    price: 500,
    requiredSubjectId: "coding",
    requiredLevel: 3,
    rarity: "rare",
  },
  {
    id: "wizard-hat",
    name: "Wizard Hat",
    type: "accessory",
    price: 900,
    requiredSubjectId: "science",
    requiredLevel: 5,
    rarity: "epic",
  },
  {
    id: "pirate-coat",
    name: "Pirate Coat",
    type: "clothing",
    price: 550,
    requiredSubjectId: "history",
    requiredLevel: 3,
    rarity: "rare",
  },
  {
    id: "arena-crown",
    name: "Arena Crown",
    type: "badge",
    price: 1500,
    requiredSubjectId: null,
    requiredLevel: 8,
    rarity: "legendary",
  },
];
