import type { Subject } from "./types";

/**
 * Subjects represent the main learning tracks players can level up in.
 */
export const subjects: Subject[] = [
  {
    id: "math",
    name: "Math",
    description: "Practice number sense, algebra basics, and problem-solving with clear step-by-step challenges.",
    color: "#2563EB",
    icon: "➗",
    xpName: "Brain Points",
  },
  {
    id: "coding",
    name: "Coding",
    description: "Build confidence with programming ideas like variables, loops, and logic used in real apps.",
    color: "#10B981",
    icon: "💻",
    xpName: "Code XP",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Learn safe online habits, password skills, and beginner security concepts for the digital world.",
    color: "#7C3AED",
    icon: "🛡️",
    xpName: "Shield XP",
  },
  {
    id: "science",
    name: "Science",
    description: "Explore how the natural world works through simple questions about matter, energy, and life.",
    color: "#F59E0B",
    icon: "🔬",
    xpName: "Discovery XP",
  },
  {
    id: "history",
    name: "History",
    description: "Travel through important events, people, and time periods to understand how the past shapes today.",
    color: "#DC2626",
    icon: "🏛️",
    xpName: "Legacy XP",
  },
];
