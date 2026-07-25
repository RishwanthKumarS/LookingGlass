export const notePrompts: string[] = [
  "What did you learn today?",
  "Write it down before you forget!",
  "Write a reminder for later!",
  "Learn anything new today?",
  "What have you learned today?",
  "What's new?",
  "Lest you forget!",
];

export function getRandomPrompt(): string {
  return notePrompts[Math.floor(Math.random() * notePrompts.length)];
}