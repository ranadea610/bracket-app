import type { ParticipantGroup } from "./GroupedParticipantList";

/** Converts a flat 0-indexed position (matching how groups flatten at submission time) into a group + within-group slot location. */
export function resolveGroupSlot(
  groups: ParticipantGroup[],
  flatIndex: number,
): { groupIndex: number; slotIndex: number } {
  let remaining = flatIndex;

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    const size = groups[groupIndex].participants.length;
    if (remaining < size) {
      return { groupIndex, slotIndex: remaining };
    }
    remaining -= size;
  }

  throw new Error(`Flat index ${flatIndex} is out of range for the given groups.`);
}
