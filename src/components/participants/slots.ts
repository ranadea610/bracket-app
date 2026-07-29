export type ParticipantSlot = {
  id: string;
  name: string;
};

export function createParticipantSlots(count: number): ParticipantSlot[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    name: "",
  }));
}
