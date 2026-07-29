import type { Participant } from "../../tournament/types";
import { Modal } from "../Modal";

type ChampionModalProps = {
  champion: Participant;
  onClose: () => void;
};

export function ChampionModal({ champion, onClose }: ChampionModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <p className="text-sm font-medium text-indigo-400 uppercase tracking-wide">
          Tournament Champion
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-100">
          Congratulations, {champion.name}!
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
